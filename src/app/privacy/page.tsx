import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Aurora',
  description: 'Privacy Policy for Aurora Divorce Documentation Assistant',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-neutral max-w-none bg-white p-8 rounded-lg shadow-sm">
          <p className="text-lg text-neutral-600 mb-8">Last updated: January 9, 2024</p>

          <h2>1. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Account information (email, password)</li>
            <li>Incident documentation and related files</li>
            <li>Financial records and expense tracking data</li>
            <li>Calendar events and scheduling information</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process and store your documentation</li>
            <li>Protect against fraud and abuse</li>
            <li>Send you technical notices and security alerts</li>
          </ul>

          <h2>3. Data Security</h2>
          <p>We implement robust security measures including:</p>
          <ul>
            <li>End-to-end encryption for sensitive data</li>
            <li>Regular security audits and monitoring</li>
            <li>Secure data backups and disaster recovery</li>
            <li>Access controls and authentication</li>
          </ul>

          <h2>4. Data Retention</h2>
          <p>We retain your information for as long as your account is active or as needed to provide services. You can request data deletion at any time.</p>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request data deletion</li>
            <li>Export your data</li>
          </ul>

          <h2>6. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at:</p>
          <p>Email: privacy@aurora-app.com</p>
          <p>Address: 123 Privacy Street, Suite 100, San Francisco, CA 94105</p>
        </div>
      </div>
    </div>
  );
}