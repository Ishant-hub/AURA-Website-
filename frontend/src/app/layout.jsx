import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "AURA | Experience Sound Beyond Imagination",
  description: "Premium Audio, Home Cinema & Entertainment Solutions for the discerning ear.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;600;800&family=Hanken+Grotesk:wght@600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-background text-on-background flex flex-col selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden font-body-md text-body-md">
        <AuthProvider>
          <CartProvider>
            <Header />
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
