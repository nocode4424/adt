import { Toaster } from 'react-hot-toast';
import { Inter, Lora } from 'next/font/google';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

const lora = Lora({ 
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} ${lora.className}`}>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <main id="main-content">
            {children}
          </main>
          <Toaster position="top-right" />
        </ErrorBoundary>
      </body>
    </html>
  );
}