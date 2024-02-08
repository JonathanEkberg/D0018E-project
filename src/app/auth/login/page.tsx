import React from "react";
import { pool } from "@/lib/database";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function loginAction(formData: FormData) {
  "use server";
  const [email, password] = [formData.get("email"), formData.get("password")];

  if (!email || !password) {
    throw new Error("You must provide email and password!");
  }

  const query = await pool.execute(
    "SELECT id, name FROM user WHERE email=? AND password=?",
    [email, password]
  );

  const parsed = query[0] as [
    | {
        id: number;
        name: string;
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
  redirect("/");
}

interface LoginPageProps {}

export default function LoginPage({}: LoginPageProps) {
  return (
    <div className="grid place-items-center h-full">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="space-y-4">
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
            <Button type="submit">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
