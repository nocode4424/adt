import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Email | Aurora',
  description: 'Verify your email address',
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Check Your Email</h1>
          <p className="text-neutral-600">
            We sent you an email with a verification link. Please check your inbox and click the link to verify your account.
          </p>
          <p className="mt-4 text-sm text-neutral-500">
            If you don't see the email, check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}