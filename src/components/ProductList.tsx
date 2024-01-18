import { createDb } from "@/lib/database";
import { revalidatePath } from "next/cache";
import React, { useEffect } from "react";
import { RefreshButton } from "./RefreshButton";

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
  console.log(products);

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-4xl">Products</h1>
        <RefreshButton />
      </div>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <div>{product.name}</div>
            <div className="flex">
              <img src={product.image} width={96} height={96} />
              <p>{product.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
