import React from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../auth/AuthProvider';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';
import { useQueryClient } from 'react-query';

interface AssetFormData {
  name: string;
  value: number;
  status: 'active' | 'pending' | 'divided';
  division_details?: {
    ownership_split?: number;
    notes?: string;
  };
}

export function AssetForm() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AssetFormData>();

  const onSubmit = async (data: AssetFormData) => {
    try {
      const { error } = await supabase.from('assets').insert([
        {
          ...data,
          user_id: user?.id,
          metadata: {},
        },
      ]);

      if (error) throw error;

      toast.success('Asset recorded successfully');
      queryClient.invalidateQueries('assets');
      reset();
    } catch (error) {
      toast.error('Failed to record asset');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
          Asset Name
        </label>
        <input
          {...register('name', { required: 'Asset name is required' })}
          type="text"
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="value" className="block text-sm font-medium text-neutral-700">
          Estimated Value ($)
        </label>
        <input
          {...register('value', { 
            required: 'Value is required',
            min: { value: 0, message: 'Value must be positive' }
          })}
          type="number"
          step="0.01"
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.value && (
          <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-neutral-700">
          Status
        </label>
        <select
          {...register('status', { required: 'Status is required' })}
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="active">Active</option>
          <option value="pending">Pending Division</option>
          <option value="divided">Divided</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Recording...' : 'Record Asset'}
      </Button>
    </form>
  );
}