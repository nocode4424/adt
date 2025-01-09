import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_REQUESTS = {
  'POST /api/incidents': 10,
  'POST /api/expenses': 10,
  'GET /api/*': 100,
  'default': 50
};

export async function checkRateLimit(endpoint: string) {
  const supabase = createClientComponentClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return true; // Skip rate limiting for non-authenticated users

    // Get current rate limit data
    const { data: rateLimitData, error } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('endpoint', endpoint)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    const maxRequests = MAX_REQUESTS[endpoint] || MAX_REQUESTS.default;
    const now = new Date();
    const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW);

    if (rateLimitData && new Date(rateLimitData.window_start) > windowStart) {
      if (data.request_count >= MAX_REQUESTS) {
        toast.error('Rate limit exceeded. Please try again later.');
        return false;
      }

      // Update request count
      await supabase
        .from('rate_limits')
        .update({ request_count: rateLimitData.request_count + 1 })
        .eq('endpoint', endpoint);
    } else {
      // Create new rate limit entry
      await supabase
        .from('rate_limits')
        .upsert({
          endpoint,
          request_count: 1,
          window_start: now.toISOString()
        });
    }

    return true;
  } catch (error) {
    console.error('Rate limit error:', error);
    return true; // Allow request on error to prevent blocking legitimate traffic
  }
}