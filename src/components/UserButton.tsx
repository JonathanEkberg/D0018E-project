"use client";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { logoutAction } from "@/app/actions";
import { useRouter } from "next/navigation";

interface UserButtonProps {
  name: string;
}

export function UserButton({ name }: UserButtonProps) {
  const router = useRouter();

  async function onClick() {
    await logoutAction();
    router.refresh();
  }

  return (
    <Popover>
      <PopoverTrigger>
        <div className="text-xl font-bold tracking-tighter">{name}</div>
      </PopoverTrigger>
      <PopoverContent className="w-max">
        <Button onClick={onClick} type="submit">
          Logout
        </Button>
      </PopoverContent>
    </Popover>
  );
}
