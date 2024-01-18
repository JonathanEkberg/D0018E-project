"use client";

import { refreshProducts } from "@/app/actions";
import React, { useEffect, useRef } from "react";

interface RefreshButtonProps {}

export function RefreshButton({}: RefreshButtonProps) {
  const formRef = useRef<HTMLFormElement>(null);

  //   useEffect(function () {
  //     const interval = setInterval(function () {
  //       //   formRef.current?.submit();
  //       refreshProducts();
  //     }, 5000);

  //     return () => clearInterval(interval);
  //   }, []);

  return (
    <form action={refreshProducts} ref={formRef}>
      <button type="submit">Refresh</button>
    </form>
  );
}
