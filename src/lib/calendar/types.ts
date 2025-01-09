export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  type: 'court' | 'meeting' | 'deadline' | 'other';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarFilter {
  startDate?: Date;
  endDate?: Date;
  type?: CalendarEvent['type'];
  search?: string;
}