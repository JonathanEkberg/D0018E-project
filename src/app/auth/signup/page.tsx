import React from "react";
import { pool } from "@/lib/database";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

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

  const existing = await pool.execute("SELECT id FROM user WHERE email=?;", [
    email,
  ]);
  const user = existing[0] as [{ id: string } | undefined];

  if (user.length === 1) {
    throw new Error("User with email already exists.");
  }

  await pool.execute(
    "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, 'USER');",
    [name, email, password]
  );
  redirect("/");
}

interface SignupPageProps {}

export default function SignupPage({}: SignupPageProps) {
  return (
    <div className="grid place-items-center">
      <form action={signupAction} className="space-y-4">
        <div className="space-y-2">
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              type="text"
              required
              defaultValue={
                process.env.NODE_ENV === "development" ? "John Doe" : undefined
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
              required
              min={6}
              defaultValue={
                process.env.NODE_ENV === "development" ? "johndoe" : undefined
              }
            />
          </div>
        </div>
        <Button type="submit">Sign up</Button>
      </form>
    </div>
  );
}
