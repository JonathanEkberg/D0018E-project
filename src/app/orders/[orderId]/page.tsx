import React from "react"
import { unstable_cache } from "next/cache"
import { pool } from "@/lib/database"

interface OrderItemPageProps {
  params: { orderId: string }
}

export default function OrderItemPage({ params }: OrderItemPageProps) {
  return (
    <div className="grid h-full place-items-center">
      <h1 className="text-center text-[38rem] font-bold tracking-tight">
        {params.orderId}
      </h1>
    </div>
  )
}
