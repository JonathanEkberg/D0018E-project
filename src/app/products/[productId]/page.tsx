import { unstable_cache } from "next/cache";
import React from "react";
import { pool } from "@/lib/database";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/user";
import { addToCartAction } from "@/app/actions";

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
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center space-x-4">
        <Image
          src={product.image}
          alt={`${product.name} image`}
          width={148}
          height={148}
        />
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">
            {product.name}
          </h1>
          {product.stock !== null ? <div>Stock: {product.stock}</div> : null}
        </div>
        {product.price_usd !== null ? <div>${product.price_usd}</div> : null}
        <form action={addToCartAction}>
          <input hidden readOnly value={product.id} name="productId" />
          <Button type="submit">Add to cart</Button>
        </form>
      </div>
      <p className="line-clamp-3">{product.description}</p>
    </div>
  );
}
