import OpenAI from 'openai';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

const BACKUP_BUCKET = 'backups';

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Analyze incident text using GPT
export async function analyzeIncident(description: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant analyzing divorce-related incidents. 
            Analyze the incident and provide:
            1. Severity classification (high/medium/low)
            2. Emotional impact score (-1 to 1)
            3. Legal implications
            4. Recommended actions
            5. Key points to document
            Return as JSON with fields: classification, sentimentScore, legalImplications, recommendedActions, keyPoints`
        },
        {
          role: "user",
          content: description
        }
      ]
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('OpenAI API error:', error);
    return null;
  }
}

// Transcribe audio using Whisper API
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const response = await openai.audio.transcriptions.create({
      file: audioBlob,
      model: 'whisper-1',
      language: 'en'
    });

    return response.text;
  } catch (error) {
    console.error('Whisper API error:', error);
    throw error;
  }
}

// Backup data to Supabase storage
export async function backupData() {
  const supabase = createClientComponentClient();
  const timestamp = new Date().toISOString();

  try {
    // Fetch all user data
    const tables = ['incidents', 'expenses', 'assets'];
    const data: Record<string, any> = {};

    for (const table of tables) {
      const { data: tableData, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      data[table] = tableData;
    }

    // Create backup file
    const backupContent = JSON.stringify(data, null, 2);
    const backupBlob = new Blob([backupContent], { type: 'application/json' });
    const backupFile = new File([backupBlob], `backup-${timestamp}.json`);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BACKUP_BUCKET)
      .upload(`${timestamp}/backup.json`, backupFile);

    if (uploadError) throw uploadError;

    // Create backup record
    const { error: recordError } = await supabase
      .from('backups')
      .insert({
        timestamp,
        size_bytes: backupFile.size,
        tables_included: tables,
        status: 'completed'
      });

    if (recordError) throw recordError;

    return { success: true, timestamp };
  } catch (error) {
    console.error('Backup error:', error);
    throw error;
  }
}