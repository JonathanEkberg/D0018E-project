import React from "react";
import { pool } from "@/lib/database";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import review1 from "../../../../public/review-1.jpg";
import { Noto_Serif } from "next/font/google";
import clsx from "clsx";
import { Star } from "lucide-react";
import { ReviewImage } from "@/components/ReviewImage";

async function loginAction(formData: FormData) {
  "use server";
  const [email, password] = [formData.get("email"), formData.get("password")];

  if (!email || !password) {
    throw new Error("You must provide email and password!");
  }

  const query = await pool.execute(
    "SELECT id, name, role FROM user WHERE email=? AND password=?",
    [email, password]
  );

  const parsed = query[0] as [
    | {
        id: number;
        name: string;
        role: "USER" | "ADMIN";
      }
    | undefined
  ];

  const user = parsed[0];

  if (!user) {
    throw new Error("User not found");
  }

  const cookie_store = cookies();

  cookie_store.set("u_id", String(user.id), { maxAge: 3600 * 24 });
  cookie_store.set("u_name", user.name, { maxAge: 3600 * 24 });
  cookie_store.set("u_role", user.role, { maxAge: 3600 * 24 });
  redirect("/");
}

interface LoginPageProps {}

export default function LoginPage({}: LoginPageProps) {
  return (
    <div className="grid md:grid-cols-2 h-full">
      <div className="relative w-full h-full bg-red-600/50 md:block hidden">
        <div className="absolute left-0 w-1/2 h-full bg-gradient-to-r from-zinc-950/50 to-zinc-950/60 z-10"></div>
        <div className="absolute right-0 w-1/2 h-full bg-gradient-to-r from-zinc-950/60 to-zinc-950/80 z-10"></div>
        <div className="absolute left-0 top-0 bottom-0 right-0 w-full h-full">
          {/* <Image */}
          <ReviewImage
            // src={review1}
            alt="Review"
            placeholder="blur"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute left-8 bottom-16 z-20 space-y-4 pr-8">
          <div className="flex items-center space-x-4">
            <blockquote className="block text-5xl text-white font-semibold font-serif tracking-tight">
              &quot;De godaste äggen jag har ätit.&quot;
            </blockquote>
            <span className="text-5xl 2xl:block hidden">-</span>
            <div className="space-x-1 hidden 2xl:flex">
              {Array(5)
                .fill(null)
                .map((_, idx) => (
                  <Star key={idx} size={32} stroke="#f7bf23" fill="#ebaf2f" />
                ))}
            </div>
          </div>
          <cite className="pl-6 not-italic text-white/75 text-xl block">
            - Edward Blom
          </cite>
        </div>
      </div>
      <div className="grid place-items-center px-12">
        <form
          action={loginAction}
          className="w-full max-w-lg mx-auto space-y-4 flex flex-col items-center"
        >
          <div className="w-full">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your account to start buying eggs today.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    required
                    defaultValue={
                      process.env.NODE_ENV === "development"
                        ? "john@doe.com"
                        : undefined
                    }
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    min={6}
                    defaultValue={
                      process.env.NODE_ENV === "development"
                        ? "johndoe"
                        : undefined
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </CardFooter>
          </div>
          <p className="text-muted-foreground text-center w-8/10 max-w-72">
            By continuing, you agree to our{" "}
            <a className="underline" href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="underline" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
