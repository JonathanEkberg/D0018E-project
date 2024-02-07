import React from "react";
import { pool } from "@/lib/database";
import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const getShoppingCartItems = async (userId: number) => {
  const data = await pool.execute(
    `SELECT
sci.id as sci_id, sci.amount as sci_amount,
p.id as p_id, p.name as p_name, p.image as p_image, p.price_usd as p_price_usd
FROM shopping_cart_item sci
INNER JOIN product p ON p.id = sci.product_id
WHERE sci.user_id = ?;`,
    [userId]
  );

  return data[0] as {
    sci_id: number;
    sci_amount: number;
    p_id: number;
    p_name: string;
    p_image: string;
    p_price_usd: number | null;
  }[];
};

interface CartPageProps {}

export default async function CartPage({}: CartPageProps) {
  const user = getUser();

  if (!user) {
    redirect("/");
  }
  const items = await getShoppingCartItems(user.id);

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Shopping cart</h1>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.sci_id}>
            <div className="flex items-center space-x-4">
              <Image
                src={item.p_image}
                alt={`${item.p_name} image`}
                width={96}
                height={96}
              />
              <div className="textl-2xl font-bold tracking-tight flex-grow">
                {item.p_name}
              </div>
              <div className="textl-2xl font-bold tracking-tight flex-grow">
                {item.p_price_usd + "$"}
              </div>
              <div>
                <Label>Amount</Label>
                <Input type="number" value={item.sci_amount} />
              </div>
              <form>
                <Button size="icon">
                  <Trash />
                </Button>
              </form>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8">{JSON.stringify(items, undefined, 4)}</div>
    </div>
  );
}
