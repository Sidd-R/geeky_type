"use client";
import { Socket } from "socket.io-client";

// export const io = new Socket("https://localhost:8080")

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>    
        {children}
    </div>
  );
}
