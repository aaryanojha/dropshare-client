import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DropShare - Seamless Text & File Sharing",
  description: "DropShare is a simple web app for instantly sharing text and files across devices. No login required, just paste, share, and go!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        
        <main className="flex-1">
          {children}
        </main>

        <footer className="footer">
          © 2026 DropShare. All rights reserved.
        </footer>

      </body>
    </html>
  );
}
