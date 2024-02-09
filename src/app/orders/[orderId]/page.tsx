import React from "react";
import { unstable_cache } from "next/cache";
import { pool } from "@/lib/database";

interface OrderItemPageProps {
  params: { orderId: string };
}

export default function OrderItemPage({ params }: OrderItemPageProps) {
  return (
    <div className="h-full grid place-items-center">
      <h1 className="text-[42rem] font-bold tracking-tight text-center">
        {params.orderId}
      </h1>
    </div>
  );
}
