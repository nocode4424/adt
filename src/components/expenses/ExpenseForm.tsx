import React from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../auth/AuthProvider';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';
import { useQueryClient } from 'react-query';

interface ExpenseFormData {
  amount: number;
  category: string;
  description: string;
  date: string;
}

export function ExpenseForm() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ExpenseFormData>();

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      const { error } = await supabase.from('expenses').insert([
        {
          ...data,
          user_id: user?.id,
          metadata: {},
        },
      ]);

      if (error) throw error;

      toast.success('Expense recorded successfully');
      queryClient.invalidateQueries('expenses');
      reset();
    } catch (error) {
      toast.error('Failed to record expense');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-neutral-700">
          Amount ($)
        </label>
        <input
          {...register('amount', { 
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' }
          })}
          type="number"
          step="0.01"
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-neutral-700">
          Category
        </label>
        <select
          {...register('category', { required: 'Category is required' })}
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Select category</option>
          <option value="legal">Legal Fees</option>
          <option value="housing">Housing</option>
          <option value="childcare">Childcare</option>
          <option value="medical">Medical</option>
          <option value="utilities">Utilities</option>
          <option value="other">Other</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
          Description
        </label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={3}
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-neutral-700">
          Date
        </label>
        <input
          {...register('date', { required: 'Date is required' })}
          type="date"
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Recording...' : 'Record Expense'}
      </Button>
    </form>
  );
}