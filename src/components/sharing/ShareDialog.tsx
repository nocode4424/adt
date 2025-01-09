import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Share2, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';

interface ShareDialogProps {
  resourceId: string;
  resourceType: 'incident' | 'expense' | 'asset';
}

export function ShareDialog({ resourceId, resourceType }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState<'read' | 'write'>('read');
  const [expiresIn, setExpiresIn] = useState('7');
  const [shareLink, setShareLink] = useState('');
  const supabase = createClientComponentClient();

  const generateShareLink = async () => {
    try {
      const { data, error } = await supabase
        .from('shared_access')
        .insert({
          shared_with_email: email,
          access_level: accessLevel,
          expires_at: new Date(Date.now() + parseInt(expiresIn) * 24 * 60 * 60 * 1000).toISOString(),
          metadata: {
            resource_id: resourceId,
            resource_type: resourceType
          }
        })
        .select('id')
        .single();

      if (error) throw error;

      const link = `${window.location.origin}/shared/${data.id}`;
      setShareLink(link);
      toast.success('Share link generated successfully');
    } catch (error) {
      toast.error('Failed to generate share link');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Share</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-neutral-300"
                  placeholder="Enter recipient's email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Access Level
                </label>
                <select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value as 'read' | 'write')}
                  className="mt-1 block w-full rounded-md border-neutral-300"
                >
                  <option value="read">View Only</option>
                  <option value="write">Can Edit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Expires In (Days)
                </label>
                <select
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(e.target.value)}
                  className="mt-1 block w-full rounded-md border-neutral-300"
                >
                  <option value="1">1 day</option>
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>

              {shareLink ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 rounded-md border-neutral-300"
                  />
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button onClick={generateShareLink} className="w-full">
                  Generate Link
                </Button>
              )}

              <div className="flex justify-end mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}