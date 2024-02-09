import React from "react";
import { pool } from "@/lib/database";
import { Button } from "../ui/button";
import { Card, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { unstable_cache } from "next/cache";
import { getUser } from "@/lib/user";

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

interface ProductListContentProps {}

export async function ProductListContent({}: ProductListContentProps) {
  const user = getUser();
  const products = await getProducts();

  return (
    <ul className="space-y-6">
      {products.map((product) => (
        <li key={product.id}>
          <Card className="px-6 py-4">
            <div className="flex items-center space-x-4 h-full">
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
              <div className="space-y-2 flex-grow flex flex-col items-start h-full">
                <CardTitle className="text-2xl pb-2 border-b  lg:text-3xl flex items-center gap-3">
                  {product.name}
                  <Badge>Egg</Badge>
                </CardTitle>
                <div className="h-full flex-grow w-full">
                  <p className="line-clamp-3 text-base text-muted-foreground h-full">
                    {product.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <Button className="w-full" asChild>
                  <Link href={`/products/${product.id}`}>View</Link>
                </Button>
                {user?.role === "ADMIN" && (
                  <Button variant="secondary" className="w-full" asChild>
                    <Link href={`/admin/edit-product/${product.id}`}>Edit</Link>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export function ProductListContentLoading() {
  return (
    <ul className="space-y-6 w-full">
      {Array(10)
        .fill(null)
        .map((_, idx) => (
          <li key={idx} className="w-full h-40">
            <Card className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="relative aspect-[3/4] h-32 rounded-lg">
                  <Skeleton className="w-full h-full rounded-lg" />
                </div>
                <div className="space-y-2 w-full">
                  <CardTitle className="text-2xl pb-2 border-b lg:text-3xl flex items-center gap-3">
                    <Skeleton className="h-6 w-24" />
                  </CardTitle>
                  <Skeleton className="w-full h-16" />
                </div>

                <Skeleton className="w-20 h-10" />
              </div>
            </Card>
          </li>
        ))}
    </ul>
  );
}
