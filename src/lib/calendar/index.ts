import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import type { CalendarEvent, CalendarFilter } from './types';

export async function createEvent(event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) {
  const supabase = createClientComponentClient();

  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert({
        ...event,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

export async function getEvents(filter?: CalendarFilter) {
  const supabase = createClientComponentClient();

  try {
    let query = supabase
      .from('calendar_events')
      .select('*')
      .order('start_time', { ascending: true });

    if (filter?.startDate) {
      query = query.gte('start_time', filter.startDate.toISOString());
    }

    if (filter?.endDate) {
      query = query.lte('end_time', filter.endDate.toISOString());
    }

    if (filter?.type) {
      query = query.eq('type', filter.type);
    }

    if (filter?.search) {
      query = query.or(`title.ilike.%${filter.search}%,description.ilike.%${filter.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

export async function updateEvent(id: string, updates: Partial<CalendarEvent>) {
  const supabase = createClientComponentClient();

  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

export async function deleteEvent(id: string) {
  const supabase = createClientComponentClient();

  try {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}