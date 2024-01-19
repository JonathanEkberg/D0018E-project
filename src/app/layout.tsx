import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

function getClassTheme(): "dark" | undefined {
  const HEADER_NAME = "Sec-Ch-Prefers-Color-Scheme";
  const headersList = headers();

  if (!headersList.has(HEADER_NAME)) {
    return undefined;
  }

  const value = headersList.get(HEADER_NAME)!;

  if (value === "dark") {
    return value;
  }

  return undefined;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = getClassTheme();

  return (
    <html lang="en" className={theme ?? "dark"}>
      <body className={inter.className}>
        <header className="max-w-lg w-full mx-auto flex justify-center items-center space-x-4 py-4">
          <Image
            loading="eager"
            src="/logo.png"
            alt="Egg store logo"
            width={64}
            height={64}
          />
          <h1 className="text-5xl font-bold tracking-tighter">Egg store</h1>
        </header>
        {children}
      </body>
    </html>
  );
}
