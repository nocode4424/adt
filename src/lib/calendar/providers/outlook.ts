const OUTLOOK_SCOPES = [
  'Calendars.ReadWrite',
  'offline_access'
];

export async function connectOutlookCalendar() {
  const clientId = import.meta.env.VITE_OUTLOOK_CLIENT_ID;
  if (!clientId) throw new Error('Outlook client ID not configured');

  const redirectUri = `${window.location.origin}/calendar/outlook/callback`;
  const scope = OUTLOOK_SCOPES.join(' ');

  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

  window.location.href = authUrl;
}

export async function handleOutlookCallback(code: string) {
  const supabase = createClientComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  try {
    const response = await fetch('/api/calendar/outlook/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if (!response.ok) throw new Error('Failed to exchange code for tokens');

    const { access_token, refresh_token } = await response.json();

    // Store tokens in Supabase
    await supabase.from('calendar_connections').upsert({
      user_id: user.id,
      provider: 'outlook',
      access_token,
      refresh_token,
      connected_at: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error('Outlook Calendar connection error:', error);
    throw error;
  }
}

export async function syncOutlookEvents(startDate: Date, endDate: Date) {
  const supabase = createClientComponentClient();
  const { data: connection } = await supabase
    .from('calendar_connections')
    .select('access_token')
    .eq('provider', 'outlook')
    .single();

  if (!connection) throw new Error('Outlook Calendar not connected');

  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/calendar/events?$filter=start/dateTime ge '${startDate.toISOString()}' and end/dateTime le '${endDate.toISOString()}'`,
      {
        headers: {
          Authorization: `Bearer ${connection.access_token}`
        }
      }
    );

    if (!response.ok) throw new Error('Failed to fetch Outlook Calendar events');

    const { value } = await response.json();
    return value.map(transformOutlookEvent);
  } catch (error) {
    console.error('Outlook Calendar sync error:', error);
    throw error;
  }
}