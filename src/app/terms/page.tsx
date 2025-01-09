import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Aurora',
  description: 'Terms of Service for Aurora Divorce Documentation Assistant',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-neutral max-w-none bg-white p-8 rounded-lg shadow-sm">
          <p className="text-lg text-neutral-600 mb-8">Last updated: January 9, 2024</p>

          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using Aurora, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>

          <h2>2. Service Description</h2>
          <p>Aurora provides a platform for documenting and managing divorce-related information, including:</p>
          <ul>
            <li>Incident documentation</li>
            <li>Expense tracking</li>
            <li>Asset management</li>
            <li>Calendar scheduling</li>
          </ul>

          <h2>3. User Responsibilities</h2>
          <p>You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of your account</li>
            <li>Providing accurate information</li>
            <li>Complying with all applicable laws</li>
            <li>Protecting your login credentials</li>
          </ul>

          <h2>4. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Violate any laws or regulations</li>
            <li>Infringe upon others' rights</li>
            <li>Share false or misleading information</li>
            <li>Attempt to breach system security</li>
          </ul>

          <h2>5. Data Usage</h2>
          <p>We handle your data in accordance with our Privacy Policy. You retain ownership of your content while granting us necessary licenses to provide our services.</p>

          <h2>6. Termination</h2>
          <p>We reserve the right to terminate or suspend access to our services for violations of these terms or for any other reason at our discretion.</p>

          <h2>7. Disclaimer of Warranties</h2>
          <p>The service is provided "as is" without warranties of any kind, either express or implied.</p>

          <h2>8. Contact Information</h2>
          <p>For questions about these Terms, please contact us at:</p>
          <p>Email: legal@aurora-app.com</p>
          <p>Address: 123 Legal Street, Suite 200, San Francisco, CA 94105</p>
        </div>
      </div>
    </div>
  );
}