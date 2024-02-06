import React from "react";
import { pool } from "@/lib/database";
import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";

const getShoppingCartItems = async (id: number) => {
  //TODO make work
  const data = await pool.execute(
    `SELECT count(*) id, name, description, image, price_usd, stock FROM product WHERE id = ?;`,
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

interface CartPageProps {}

export default function CartPage({}: CartPageProps) {
  const user = getUser();

  if (!user) {
    redirect("/");
  }

  return <div>{user.name}</div>;
}
