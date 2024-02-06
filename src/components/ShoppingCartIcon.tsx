import React from "react";
import { pool } from "@/lib/database";
import Link from "next/link";
import { Button } from "./ui/button";
import { getUser } from "@/lib/user";
import { ShoppingBasket } from "lucide-react";

async function getShoppingCartCount(userId: number) {
  const query = await pool.execute(
    `SELECT count(*) c FROM shopping_cart_item WHERE shopping_cart_item.user_id = ?;`,
    [userId]
  );
  //   query[0];
  //   return (query[0] as [{}])[0];
  return (query[0] as [{ c: number }])[0].c;
}

interface ShoppingCartIconProps {}

export async function ShoppingCartIcon({}: ShoppingCartIconProps) {
  const user = getUser();

  if (!user) {
    return null;
  }

  const count = await getShoppingCartCount(user.id);
  console.log(":COUNT", count);

  return (
    <Link href={`/cart`} className="relative">
      <Button size="icon">
        <ShoppingBasket />
      </Button>

      {count !== 0 && (
        <div className="absolute -top-3 -right-3 bg-black rounded-full min-w-6 min-h-6 text-center p-0.5 font-bold">
          {count}
        </div>
      )}
    </Link>
  );
}
