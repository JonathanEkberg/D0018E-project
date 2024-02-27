import React from "react"

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
