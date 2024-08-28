import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Toastify from "@/components/toastify/toastify";
import { AuthProvider } from "@/contexts/authContext";
import { ThemeContextProvider } from "@/contexts/theme/themeContext";
import { CssBaseline } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Ocorrências",
  description: "Sistema de ocorrências realizado por Samba Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <ThemeContextProvider>
        <CssBaseline />
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toastify />
        </ThemeContextProvider>
      </body>
    </html>
  );
}
