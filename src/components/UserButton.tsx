"use client";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { logoutAction } from "@/app/actions";

interface UserButtonProps {
  name: string;
}

export function UserButton({ name }: UserButtonProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="text-xl font-bold tracking-tighter">{name}</div>
      </PopoverTrigger>
      <PopoverContent>
        <form action={logoutAction}>
          <Button type="submit">Logout</Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
