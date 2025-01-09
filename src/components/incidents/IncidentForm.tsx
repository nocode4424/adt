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
      const { error: incidentError } = await supabase
        .from('incidents')
        .insert({
          ...data,
          audio_url: audioUrl,
          ai_analysis: aiAnalysis,
        });

      if (incidentError) throw incidentError;

      toast.success('Incident recorded successfully');
      router.refresh();
      onComplete?.();
    } catch (error) {
      console.error('Error submitting incident:', error);
      toast.error('Failed to record incident');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type of Incident
          </label>
          <select
            {...register('type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="verbal">Verbal</option>
            <option value="physical">Physical</option>
            <option value="financial">Financial</option>
            <option value="other">Other</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <RichTextEditor
            onChange={(value) => setValue('description', value)}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date and Time
          </label>
          <input
            type="datetime-local"
            {...register('occurred_at')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.occurred_at && (
            <p className="mt-1 text-sm text-red-600">
              {errors.occurred_at.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            {...register('location')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sensitivity Level
          </label>
          <select
            {...register('sensitivity_level')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.sensitivity_level && (
            <p className="mt-1 text-sm text-red-600">
              {errors.sensitivity_level.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Voice Recording
          </label>
          <VoiceRecorder onRecordingComplete={setAudioBlob} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Attachments
          </label>
          <FileUploader onChange={() => {}} />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Recording Incident...' : 'Record Incident'}
      </Button>
    </form>
  );
}