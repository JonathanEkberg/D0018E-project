import { createDb } from "@/lib/database";
import { revalidatePath } from "next/cache";
import React, { useEffect } from "react";
import { RefreshButton } from "./RefreshButton";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export async function getProducts() {
  const db = await createDb();
  const data = await db.query(
    `SELECT * FROM product ORDER BY created_at DESC LIMIT 10;`
  );
  db.destroy();
  return data[0] as {
    id: number;
    name: string;
    description: string;
    image: string;
  }[];
}

interface ProductListProps {}

export async function ProductList({}: ProductListProps) {
  const products = await getProducts();

  return (
    <div>
      <div className="flex justify-between pb-4">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Products
        </h1>
        <RefreshButton />
      </div>
      <ul className="space-y-6">
        {products.map((product) => (
          <li key={product.id}>
            <Card className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="relative aspect-[3/4] h-32">
                  {/* Show skeleton loader on images without alpha channel */}
                  {product.image.endsWith(".jpg") ||
                  product.image.endsWith(".jpeg") ? (
                    <Skeleton className="w-full h-full" />
                  ) : null}
                  <Image
                    className="object-cover rounded-lg"
                    alt={`${product.name} image`}
                    src={product.image}
                    fill
                  />
                </div>
                <div>
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  <p className="line-clamp-4">{product.description}</p>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
