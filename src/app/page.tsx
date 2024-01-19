import { CreateProduct } from "@/components/CreateProduct";
import { ProductList } from "@/components/ProductList";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <main className="flex min-h-screen max-w-xl flex-col items-center justify-between p-8 mx-auto space-y-16">
      <CreateProduct />
      <ProductList />
    </main>
  );
}
