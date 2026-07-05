import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import ThemeProvider from "../components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Camptel AI",
  description: "Campus pulse analytics dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('theme');
                if (!theme) theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-surface-50 text-surface-900 dark:bg-dark-50 dark:text-dark-800 transition-colors duration-300">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <footer className="border-t border-surface-200 bg-white/80 py-4 text-center text-sm text-surface-500 dark:border-dark-200 dark:bg-dark-100/80 dark:text-dark-500 transition-colors duration-300">
              Camptel AI • Campus decision intelligence
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
