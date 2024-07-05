import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import "./globals.css";
import Providers from "@/components/Providers"
import {Toaster} from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatPDF Kevin",
};

export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Providers>
        
        <html lang='en'>
          <body>
          
            {children}
            <Toaster/>
          </body>
        </html>
        
       </Providers>
  </ClerkProvider>
  );
}
