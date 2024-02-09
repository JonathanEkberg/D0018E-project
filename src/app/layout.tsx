import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { UserButton } from "@/components/UserButton";
import { ShoppingCartIcon } from "@/components/ShoppingCartIcon";
import { Toaster } from "@/components/ui/sonner";
import clsx from "clsx";
import { getUser } from "@/lib/user";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Egg Store",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [uid, name] = [cookies().get("u_id"), cookies().get("u_name")];
  const user = getUser();

  return (
    <html lang="en" className={clsx("dark", inter.variable)}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("anti-flash");setTimeout(()=>document.documentElement.classList.remove("anti-flash"),100)`,
          }}
        />
      </head>
      <body className="flex flex-col">
        <header className="max-w-4xl w-full mx-auto flex justify-between items-center p-4">
          <Link href="/" className="flex items-center space-x-4">
            <Image
              className="w-12"
              loading="eager"
              src="/logo.png"
              alt="Egg store logo"
              width={256}
              height={310}
            />
            <h1 className="text-4xl font-bold tracking-tighter">Egg store</h1>
          </Link>
          {!user ? (
            <div className="space-x-4">
              <Button asChild>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </div>
          ) : (
            <div className="space-x-4 flex items-center">
              <UserButton name={user.name} />
              <ShoppingCartIcon />
            </div>
          )}
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
