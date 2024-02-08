import { unstable_cache } from "next/cache";
import React from "react";
import { pool } from "@/lib/database";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/user";
import { addToCartAction } from "@/app/actions";
import { Card, CardContent } from "@/components/ui/card";
import { BoxIcon } from "lucide-react";
import clsx from "clsx";
import { AddToCart } from "@/components/ProductPage/AddToCart";

// const getProduct = unstable_cache(
const getProduct = async (id: number) => {
  const data = await pool.execute(
    `SELECT id, name, description, image, price_usd, stock FROM product WHERE id = ?;`,
    [id]
  );

  return (
    data[0] as [
      | {
          id: number;
          name: string;
          description: string;
          image: string;
          price_usd: number | null;
          stock: number | null;
        }
      | undefined
    ]
  )[0];
};
//   ["product-id"],
//   { tags: ["product-id"] }
// );

interface ProductPageProps {
  // From the '[productsId]' dynamic route
  params: { productId: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = parseInt(params.productId);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const product = await getProduct(productId);

  // Product with id doesn't exist
  if (product === undefined) {
    notFound();
  }
  return (
    <div className="max-w-2xl mx-auto space-y-8 pt-8">
      <div className="flex items-center space-x-6">
        <Image
          className="rounded-xl"
          src={product.image}
          alt={`${product.name} image`}
          width={148}
          height={148}
        />
        <div className="flex-grow">
          <h1 className="text-5xl font-bold mb-2 tracking-tight">
            {product.name}
          </h1>
        </div>
        <div className="flex items-center flex-col space-y-4 border rounded-md p-4">
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold">
              ${product.price_usd ?? "?"}
            </div>
            <div className="flex items-center space-x-1">
              <BoxIcon
                size={20}
                className={clsx(
                  product.stock && product.stock > 0
                    ? "text-teal-500"
                    : "text-red-500"
                )}
              />
              <div className="text-muted-foreground">
                {product.stock !== null ? (
                  product.stock > 0 ? (
                    <>
                      In stock:{" "}
                      <span className="text-foreground font-medium">
                        {product.stock}
                      </span>
                    </>
                  ) : (
                    <>
                      Out of stock:{" "}
                      <span className="text-foreground font-medium">0</span>
                    </>
                  )
                ) : (
                  <>Out of stock</>
                )}
              </div>
            </div>
          </div>
          <AddToCart productId={product.id} productStock={product.stock ?? 0} />
          {/* <form action={addToCartAction}>
            <input hidden readOnly value={product.id} name="productId" />
            <Button type="submit" disabled={!product.stock}>
              Add to cart
            </Button>
          </form> */}
        </div>
      </div>

      <p className="line-clamp-3">{product.description}</p>
    </div>
  );
}
