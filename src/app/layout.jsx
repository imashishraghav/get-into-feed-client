import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './globals.css';

export const metadata = {
  title: 'Get Into Feed | Digital Marketing Agency',
  description: 'Full-service digital marketing agency specializing in SEO, content, and growth.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}