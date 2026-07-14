import './globals.css';
import { Toaster } from 'react-hot-toast';
import SessionWrapper from '../components/providers/SessionWrapper';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export const metadata = {
  title: {
    default: 'House of Politics — Dress Like Power',
    template: '%s | House of Politics',
  },
  description: 'House of Politics is a premium menswear brand for those who lead. Crafted for boardrooms, built for legacies.',
  keywords: ['luxury menswear', 'political fashion', 'power dressing', 'premium suits', 'House of Politics'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SessionWrapper>
          <CartProvider>
            <WishlistProvider>
              <AnnouncementBar />
              <div className="pt-8">
                <Navbar />
                <main>{children}</main>
                <Footer />
              </div>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: '#1f1f1f',
                    color: '#f5f0e8',
                    border: '1px solid #333',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                  },
                  success: { iconTheme: { primary: '#D4AF37', secondary: '#0A0A0A' } },
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
