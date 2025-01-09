import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { createEvent, updateEvent } from '@/lib/calendar';
import type { CalendarEvent } from '@/lib/calendar/types';
import { toast } from 'react-hot-toast';

interface EventFormProps {
  event?: CalendarEvent;
  onComplete?: () => void;
}

export function EventForm({ event, onComplete }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: event ? {
      title: event.title,
      description: event.description,
      startTime: format(new Date(event.startTime), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm"),
      location: event.location,
      type: event.type
    } : {}
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (event) {
        await updateEvent(event.id, data);
        toast.success('Event updated');
      } else {
        await createEvent(data);
        toast.success('Event created');
      }
      onComplete?.();
    } catch (error) {
      toast.error('Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Title
        </label>
        <input
          type="text"
          {...register('title', { required: 'Title is required' })}
          className="mt-1 block w-full rounded-md border-neutral-300"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Type
        </label>
        <select
          {...register('type', { required: 'Type is required' })}
          className="mt-1 block w-full rounded-md border-neutral-300"
        >
          <option value="court">Court Date</option>
          <option value="meeting">Meeting</option>
          <option value="deadline">Deadline</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Start Time
          </label>
          <input
            type="datetime-local"
            {...register('startTime', { required: 'Start time is required' })}
            className="mt-1 block w-full rounded-md border-neutral-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            End Time
          </label>
          <input
            type="datetime-local"
            {...register('endTime', { required: 'End time is required' })}
            className="mt-1 block w-full rounded-md border-neutral-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Location
        </label>
        <input
          type="text"
          {...register('location')}
          className="mt-1 block w-full rounded-md border-neutral-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-neutral-300"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onComplete?.()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
}