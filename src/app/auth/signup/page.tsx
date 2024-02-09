import React from "react";
import { pool } from "@/lib/database";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReviewImage } from "@/components/ReviewImage";
import { Star } from "lucide-react";

async function signupAction(formData: FormData) {
  "use server";
  const [name, email, password] = [
    formData.get("name"),
    formData.get("email"),
    formData.get("password"),
  ];

  if (!email || !password) {
    throw new Error("You must provide email and password!");
  }

  const existing = await pool.execute(
    "SELECT id, name FROM user WHERE email=?;",
    [email]
  );
  const user = existing[0] as [{ id: number; name: string } | undefined];

  if (user.at(0) === undefined) {
    throw new Error("User with email already exists.");
  }

  await pool.execute(
    "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, 'USER');",
    [name, email, password]
  );
  cookies().set("u_id", String(user[0]!.id), { maxAge: 3600 * 24 });
  cookies().set("u_name", user[0]!.name, { maxAge: 3600 * 24 });
  cookies().set("u_role", "USER", { maxAge: 3600 * 24 });
  redirect("/");
}

interface SignupPageProps {}

export default function SignupPage({}: SignupPageProps) {
  return (
    <div className="grid md:grid-cols-2 h-full">
      <div className="relative w-full h-full bg-red-600/50 md:block hidden">
        <div className="absolute left-0 w-1/2 h-full bg-gradient-to-r from-zinc-950/50 to-zinc-950/60 z-10"></div>
        <div className="absolute right-0 w-1/2 h-full bg-gradient-to-r from-zinc-950/60 to-zinc-950/80 z-10"></div>
        <div className="absolute left-0 top-0 bottom-0 right-0 w-full h-full">
          <ReviewImage
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
      <div className="grid w-full place-items-center px-12">
        <form
          action={signupAction}
          className="max-w-lg w-full mx-auto flex flex-col items-center space-y-4"
        >
          <div className="w-full">
            <CardHeader>
              <CardTitle>Sign up</CardTitle>
              <CardDescription>
                Create an account to start buying eggs today.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <Label>Name</Label>
                  <Input
                    name="name"
                    type="text"
                    required
                    defaultValue={
                      process.env.NODE_ENV === "development"
                        ? "John Doe"
                        : undefined
                    }
                  />
                </div>
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
                    autoComplete="new-password"
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
                Sign up
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
