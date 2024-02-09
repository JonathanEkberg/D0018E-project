"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { PlusIcon, StarIcon } from "lucide-react";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { makeReviewAction } from "@/app/actions";
import { toast } from "sonner";
import { Label } from "../ui/label";

interface MakeReviewButtonProps {
  productId: number;
}

export function MakeReviewButton({ productId }: MakeReviewButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [stars, setStars] = useState<number>(5);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("ASDHKASDHKLASDJKLHASJKLD");
    setLoading(true);
    try {
      e.preventDefault();
      console.log(e.target);

      if (!("review" in e.target)) {
        return;
      }

      const reviewInput = e.target["review"] as HTMLTextAreaElement;
      const form = new FormData();
      form.set("stars", String(stars));
      form.set("review", reviewInput.value);
      form.set("productId", String(productId));
      await makeReviewAction(form);
      setOpen(false);
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={loading}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Make review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} className="space-y-2">
          <DialogHeader>
            <DialogTitle>Make review</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Stars</Label>
            <div className="flex items-center">
              {Array(5)
                .fill(null)
                .map((_, idx) => (
                  <StarIcon
                    className="cursor-pointer"
                    onClick={() => setStars(idx + 1)}
                    size={20}
                    fill={stars > idx ? "#fff" : "#000"}
                    stroke={stars > idx ? "#fff" : "#fff9"}
                    key={idx}
                  />
                ))}
            </div>
          </div>
          <div>
            <Label>Review</Label>
            <Textarea className="max-h-64" name="review" />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
