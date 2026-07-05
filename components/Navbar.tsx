"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

const links = [
  { href: "/", label: "Dashboard", icon: "◈" },
  { href: "/challenges", label: "Challenges", icon: "🧩" },
  { href: "/assistant", label: "Assistant", icon: "✦" },
  { href: "/performance", label: "Performance", icon: "⚡" },
];

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="rounded-xl border border-surface-200 p-2.5 text-surface-500 transition hover:bg-surface-100 hover:text-surface-700 dark:border-dark-200 dark:text-dark-500 dark:hover:bg-dark-100 dark:hover:text-dark-700"
    >
      {theme === "light" ? (
        <svg className="h-5 w-5 animate-theme-switch" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      ) : (
        <svg className="h-5 w-5 animate-theme-switch" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 border-b border-surface-200 bg-white/90 shadow-sm backdrop-blur-xl dark:border-dark-200 dark:bg-dark-100/90 dark:shadow-black/10 transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-lg font-bold text-white shadow-lg shadow-brand-600/20 transition-transform duration-300 group-hover:scale-105">
            C
          </div>
          <div>
            <p className="text-sm font-semibold text-surface-900 dark:text-dark-800 transition-colors">Camptel AI</p>
            <p className="text-[11px] text-surface-400 dark:text-dark-500 transition-colors">Decision intelligence</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                    : "text-surface-500 hover:bg-surface-100 hover:text-surface-700 dark:text-dark-500 dark:hover:bg-dark-100 dark:hover:text-dark-700"
                }`}
              >
                <span className="text-xs">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
          <div className="ml-2 pl-2 border-l border-surface-200 dark:border-dark-200">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="rounded-xl border border-surface-200 p-2.5 text-surface-500 transition hover:bg-surface-100 hover:text-surface-700 dark:border-dark-200 dark:text-dark-500 dark:hover:bg-dark-100 dark:hover:text-dark-700"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-fade-in border-t border-surface-200 bg-white px-4 py-3 dark:border-dark-200 dark:bg-dark-100 md:hidden transition-colors duration-300">
          <div className="flex flex-col gap-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                      : "text-surface-600 hover:bg-surface-50 hover:text-surface-800 dark:text-dark-600 dark:hover:bg-dark-50 dark:hover:text-dark-800"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span className="text-xs">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
