import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';

export function MFASetup() {
  const [isEnabling, setIsEnabling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const supabase = createClientComponentClient();

  const enableMFA = async () => {
    try {
      setIsEnabling(true);
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });

      if (error) throw error;
      setQrCode(data.totp.qr_code);
    } catch (error) {
      toast.error('Failed to enable MFA');
    } finally {
      setIsEnabling(false);
    }
  };

  const verifyMFA = async () => {
    try {
      const { error } = await supabase.auth.mfa.challenge({
        factorId: 'totp',
        code: verificationCode
      });

      if (error) throw error;
      toast.success('MFA enabled successfully');
    } catch (error) {
      toast.error('Failed to verify MFA code');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
        <Button
          onClick={enableMFA}
          disabled={isEnabling || !!qrCode}
        >
          {isEnabling ? 'Enabling...' : 'Enable 2FA'}
        </Button>
      </div>

      {qrCode && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <img src={qrCode} alt="QR Code for 2FA" className="w-48 h-48" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Enter code from authenticator app"
            />
          </div>
          <Button onClick={verifyMFA} className="w-full">
            Verify
          </Button>
        </div>
      )}
    </div>
  );
}