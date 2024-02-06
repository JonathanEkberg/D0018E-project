import { pool } from "@/lib/database";
import React, { cache } from "react";
import { RefreshButton } from "./RefreshButton";
import Image from "next/image";
import { Card, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Button } from "./ui/button";

export const getProducts = unstable_cache(
  async () => {
    const data = await pool.execute(
      `SELECT id, name, description, image FROM product ORDER BY created_at DESC LIMIT 10;`
    );

    return data[0] as {
      id: number;
      name: string;
      description: string;
      image: string;
    }[];
  },
  ["products"],
  { tags: ["products"] }
);

interface ProductListProps {}

export async function ProductList({}: ProductListProps) {
  const products = await getProducts();

  return (
    <div>
      <div className="flex justify-between pb-4 px-2">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Products
        </h2>
        <RefreshButton />
      </div>
      <ul className="space-y-6">
        {products.map((product) => (
          <li key={product.id}>
            <Card className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="relative aspect-[3/4] h-32 rounded-lg">
                  {/* Show skeleton loader on images without alpha channel */}
                  {product.image.endsWith(".jpg") ||
                  product.image.endsWith(".jpeg") ? (
                    <Skeleton className="w-full h-full rounded-lg" />
                  ) : null}
                  <Image
                    className="object-cover rounded-lg"
                    alt={`${product.name} image`}
                    src={product.image}
                    fill
                  />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl pb-2 border-b lg:text-3xl flex items-center gap-3">
                    {product.name}
                    <Badge>Egg</Badge>
                  </CardTitle>
                  <p className="line-clamp-4 text-base text-muted-foreground">
                    {product.description}
                  </p>
                </div>
                <Link href={`/products/${product.id}`}>
                  <Button>View</Button>
                </Link>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
