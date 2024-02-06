import { CreateProduct } from "@/components/CreateProduct";
import { ProductList } from "@/components/ProductList";
import { Suspense } from "react";

export const dynamic = "auto"
export const revalidate = 3600

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-xl flex-col items-center justify-between p-8 mx-auto space-y-16">
      <CreateProduct />
      <Suspense fallback={<div>Loading...</div>}>
        <ProductList />
      </Suspense>
    </main>
  );
}
