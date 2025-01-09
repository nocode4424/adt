const GOOGLE_CALENDAR_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly'
];

export async function connectGoogleCalendar() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('Google Calendar client ID not configured');

  const redirectUri = `${window.location.origin}/calendar/google/callback`;
  const scope = GOOGLE_CALENDAR_SCOPES.join(' ');

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  window.location.href = authUrl;
}

export async function handleGoogleCallback(code: string) {
  const supabase = createClientComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  try {
    const response = await fetch('/api/calendar/google/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if (!response.ok) throw new Error('Failed to exchange code for tokens');

    const { access_token, refresh_token } = await response.json();

    // Store tokens in Supabase
    await supabase.from('calendar_connections').upsert({
      user_id: user.id,
      provider: 'google',
      access_token,
      refresh_token,
      connected_at: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error('Google Calendar connection error:', error);
    throw error;
  }
}

export async function syncGoogleEvents(startDate: Date, endDate: Date) {
  const supabase = createClientComponentClient();
  const { data: connection } = await supabase
    .from('calendar_connections')
    .select('access_token')
    .eq('provider', 'google')
    .single();

  if (!connection) throw new Error('Google Calendar not connected');

  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startDate.toISOString()}&timeMax=${endDate.toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${connection.access_token}`
        }
      }
    );

    if (!response.ok) throw new Error('Failed to fetch Google Calendar events');

    const { items } = await response.json();
    return items.map(transformGoogleEvent);
  } catch (error) {
    console.error('Google Calendar sync error:', error);
    throw error;
  }
}