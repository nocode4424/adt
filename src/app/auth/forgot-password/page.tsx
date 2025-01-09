import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password | Aurora',
  description: 'Reset your Aurora account password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-neutral-900">Reset Password</h1>
            <p className="text-neutral-600 mt-2">Enter your email to reset your password</p>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}