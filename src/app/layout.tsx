import type { Metadata } from "next";
import { EB_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import {AuthProvider} from "../components/provider/AuthProvider";
import { Toaster } from "sonner";
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Haru Memoirs",
  description: "Haru Memoirs Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body
        className={`${ebGaramond.variable} ${montserrat.variable} antialiased`}
      >
       <AuthProvider> 
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
         
      </body>
    </html>
  );
}
