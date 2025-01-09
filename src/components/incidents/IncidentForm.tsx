```tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';
import { VoiceRecorder } from './VoiceRecorder';
import { RichTextEditor } from './RichTextEditor';
import { FileUploader } from './FileUploader';
import { useRouter } from 'next/navigation';
import { analyzeIncident } from '@/lib/openai';

const incidentSchema = z.object({
  type: z.enum(['verbal', 'physical', 'financial', 'other']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  occurred_at: z.string(),
  location: z.string().optional(),
  sensitivity_level: z.enum(['high', 'medium', 'low']),
  metadata: z.record(z.any()).optional(),
});

type IncidentFormData = z.infer<typeof incidentSchema>;

interface IncidentFormProps {
  onComplete?: () => void;
}

export function IncidentForm({ onComplete }: IncidentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      sensitivity_level: 'medium',
      occurred_at: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmit = async (data: IncidentFormData) => {
    try {
      setIsLoading(true);

      // Get AI analysis
      const aiAnalysis = await analyzeIncident(data.description);

      // Upload audio if exists
      let audioUrl = null;
      if (audioBlob) {
        const { data: audioData, error: audioError } = await supabase.storage
          .from('incident-recordings')
          .upload(`${Date.now()}-recording.webm`, audioBlob);

        if (audioError) throw audioError;
        audioUrl = audioData.path;
      }

      // Create incident record
      const { error } = await supabase.from('incidents').insert([
        {
          ...data,
          ai_classification: aiAnalysis?.classification,
          sentiment_score: aiAnalysis?.sentimentScore,
          metadata: {
            ...data.metadata,
            audio_url: audioUrl,
            legal_implications: aiAnalysis?.legalImplications,
          },
        },
      ]);

      if (error) throw error;

      toast.success('Incident recorded successfully');
      router.refresh();
      onComplete?.();
    } catch (error) {
      toast.error('Failed to record incident');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioRecorded = (blob: Blob) => {
    setAudioBlob(blob);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Type of Incident
        </label>
        <select
          {...register('type')}
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="verbal">Verbal Incident</option>
          <option value="physical">Physical Incident</option>
          <option value="financial">Financial Incident</option>
          <option value="other">Other</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Voice Recording (Optional)
        </label>
        <VoiceRecorder onRecordingComplete={handleAudioRecorded} />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Description
        </label>
        <RichTextEditor
          content=""
          onChange={(content) => setValue('description', content)}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">
          When did it happen?
        </label>
        <input
          {...register('occurred_at')}
          type="datetime-local"
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.occurred_at && (
          <p className="mt-1 text-sm text-red-600">{errors.occurred_at.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Location (Optional)
        </label>
        <input
          {...register('location')}
          type="text"
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Enter location"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Sensitivity Level
        </label>
        <select
          {...register('sensitivity_level')}
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Attachments (Optional)
        </label>
        <FileUploader
          onUploadComplete={(urls) =>
            setValue('metadata', { ...register('metadata').value, attachments: urls })
          }
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Recording...' : 'Record Incident'}
      </Button>
    </form>
  );
}
```