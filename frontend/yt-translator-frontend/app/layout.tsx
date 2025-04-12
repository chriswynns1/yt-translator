"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "react-oidc-context";
require('dotenv').config('../.env')

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const cognitoAuthConfig = {
  authority: process.env.NEXT_PUBLIC_AUTHORITY,
  client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
  response_type: process.env.NEXT_PUBLIC_RESPONSE_TYPE,
  scope: "email openid phone",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="bg-gradient-to-t from-gray-900 via-neutral-900 to-red-900 h-screen">
            <AuthProvider {...cognitoAuthConfig}>
              <Navbar />
              {children}
            </AuthProvider>
          </div>
        </body>

    </html>
  );
}
