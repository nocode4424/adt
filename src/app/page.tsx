import { Metadata } from 'next';
import { Sunrise, Shield, Calendar, FileText, Lock, BarChart, Cloud, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Aurora - Divorce Documentation Assistant',
  description: 'Document and track your divorce process securely and efficiently',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <nav className="fixed top-0 left-0 right-0 h-16 border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <Sunrise className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-serif font-semibold text-neutral-900">Aurora</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-neutral-600 hover:text-neutral-900">
              Features
            </Link>
            <Link href="#security" className="text-neutral-600 hover:text-neutral-900">
              Security
            </Link>
            <Link href="#pricing" className="text-neutral-600 hover:text-neutral-900">
              Pricing
            </Link>
            <Link href="#faq" className="text-neutral-600 hover:text-neutral-900">
              FAQ
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register" className="font-medium">
                Start Free Trial
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <section className="py-32 px-6 bg-gradient-to-b from-primary-50/50 to-white">
          <div className="mx-auto max-w-7xl text-center">
            <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1 text-sm font-medium text-primary-700 mb-8">
              Trusted by over 10,000 users
            </span>
            <h1 className="mb-6 text-5xl md:text-6xl font-serif font-bold text-neutral-900 tracking-tight leading-tight">
              Document and Track Your <span className="text-primary-600">Divorce Journey</span> with Confidence
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-neutral-600 leading-relaxed">
              Aurora provides a secure, organized way to document incidents, track expenses, and manage assets during your divorce process. Stay informed, protected, and in control every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/auth/register">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-neutral-500">
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                End-to-end encryption
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                GDPR Compliant
              </div>
              <div className="flex items-center">
                <Cloud className="h-4 w-4 mr-2" />
                Automatic backups
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-white border-t border-neutral-100">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-4">
                Features Designed for Your Peace of Mind
              </h2>
              <p className="text-lg text-neutral-600">
                Every feature is thoughtfully crafted to help you navigate your divorce process with clarity and confidence.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
              {[
                {
                  icon: Shield,
                  title: 'Secure Documentation',
                  description: 'Document and organize important events with secure, time-stamped, and encrypted records that are legally admissible.',
                },
                {
                  icon: Calendar,
                  title: 'Timeline Management',
                  description: 'Keep track of all events, meetings, and court deadlines in one organized, easy-to-navigate timeline.',
                },
                {
                  icon: FileText,
                  title: 'Smart Analysis',
                  description: 'Get AI-powered insights and recommendations to help you make informed decisions throughout your journey.',
                },
                {
                  icon: BarChart,
                  title: 'Expense Tracking',
                  description: 'Track and categorize all divorce-related expenses with detailed reports and analytics.',
                },
              ].map((feature) => (
                <div key={feature.title} className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-8 transition-all hover:shadow-md hover:bg-white">
                  <feature.icon className="h-8 w-8 text-primary-500 mb-4" />
                  <h3 className="mb-3 text-xl font-semibold text-neutral-900">{feature.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-neutral-50 border-t border-neutral-100">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-4">
                Why Choose Aurora?
              </h2>
              <p className="text-lg text-neutral-600">
                Join thousands of users who trust Aurora to help them navigate their divorce journey.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="text-4xl font-bold text-primary-600 mb-4">99.9%</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Uptime Guarantee</h3>
                <p className="text-neutral-600">Access your important documents anytime, anywhere.</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="text-4xl font-bold text-primary-600 mb-4">256-bit</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Military-grade Encryption</h3>
                <p className="text-neutral-600">Your data is protected with the highest security standards.</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="text-4xl font-bold text-primary-600 mb-4">24/7</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Customer Support</h3>
                <p className="text-neutral-600">Get help when you need it, day or night.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-white border-t border-neutral-200 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Sunrise className="h-6 w-6 text-primary-600" />
                  <span className="text-xl font-serif font-semibold text-neutral-900">Aurora</span>
                </div>
                <p className="text-neutral-600">
                  Empowering you through your divorce journey with security and confidence.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 mb-4">Product</h4>
                <ul className="space-y-2 text-neutral-600">
                  <li><Link href="#features">Features</Link></li>
                  <li><Link href="#security">Security</Link></li>
                  <li><Link href="#pricing">Pricing</Link></li>
                  <li><Link href="#faq">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 mb-4">Company</h4>
                <ul className="space-y-2 text-neutral-600">
                  <li><Link href="/about">About</Link></li>
                  <li><Link href="/blog">Blog</Link></li>
                  <li><Link href="/careers">Careers</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 mb-4">Legal</h4>
                <ul className="space-y-2 text-neutral-600">
                  <li><Link href="/privacy">Privacy Policy</Link></li>
                  <li><Link href="/terms">Terms of Service</Link></li>
                  <li><Link href="/security">Security</Link></li>
                  <li><Link href="/gdpr">GDPR</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-neutral-200 text-center text-sm text-neutral-600">
              © {new Date().getFullYear()} Aurora. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}