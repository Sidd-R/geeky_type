"use client";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PreferenceProvider from "@/context";
import { AnimatePresence } from "framer-motion";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { MdClose } from "react-icons/md";
// import { ToastContainer } from "react-toastify";

import "@/styles/globals.css";
import "@/styles/theme.css";
// import "react-toastify/dist/ReactToastify.css";

import commands from "@/data/commands";

// import CommandPalette from "@/components/CommandPalette/CommandPalette";
// import Header from "@/components/Layout/Header";
// import Layout from "@/components/Layout/Layout";
import Navbar from "@/components/Navbar";
import { usePreferenceContext } from "@/context";

import { RoomProvider } from '@/room';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PreferenceProvider>
        
          <RoomProvider>
          <div className="main">
            <div className="gradient" />
          </div>
          <main className='app'>
            <Navbar />
            {children}
          </main>
          </RoomProvider> 
        </PreferenceProvider>
      </body>
    </html>
  );
}
