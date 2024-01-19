"use client";
import { Button } from "./ui/button";
import { AlertTriangle, Loader2Icon } from "lucide-react";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "./ui/alert-dialog";
import { useState } from "react";
import { resetDatabase } from "@/app/actions";

interface ResetProductsButtonProps {}

export function ResetProductsButton({}: ResetProductsButtonProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  async function onResetClick() {
    setIsLoading(true);
    try {
      await resetDatabase(new FormData());
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" type="button">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            All added products will be removed and new random products will be
            added.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* <AlertDialogAction>Continue</AlertDialogAction> */}
          {/* <AlertDialogAction> */}
          <Button
            variant="destructive"
            onClick={onResetClick}
            type="submit"
            formNoValidate
            disabled={isLoading}
          >
            {isLoading && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
            Reset
          </Button>
          {/* </AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
