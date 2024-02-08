import React from "react";
import { pool } from "@/lib/database";
import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { unstable_cache } from "next/cache";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { removeCartItemAction, updateCartItemAmountAction } from "../actions";

const getShoppingCartItems = unstable_cache(
  async (userId: number) => {
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
  },
  ["cart-items"],
  { tags: ["cart-items"] }
);

const formatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  currency: "USD",
  // unit: "1000",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

interface CartPageProps {}

export default async function CartPage({}: CartPageProps) {
  const user = getUser();

  if (!user) {
    redirect("/");
  }
  const items = await getShoppingCartItems(user.id);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* <h1 className="text-3xl font-bold tracking-tight">Shopping cart</h1> */}
      <Card>
        <CardHeader>
          <CardTitle>Shopping cart</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Product</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-right">Remove</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.sci_id}>
                  <TableCell className="font-medium flex items-center space-x-4">
                    <Image
                      className="rounded-xl"
                      src={item.p_image}
                      alt={`${item.p_name} image`}
                      width={96}
                      height={96}
                    />
                    <div className="text-xl overflow-hidden">{item.p_name}</div>
                  </TableCell>

                  <TableCell className="font-medium text-center">
                    <span className="text-muted-foreground">&#36;</span>
                    {formatter.format(item.p_price_usd ?? 0)}
                  </TableCell>

                  <TableCell className="font-medium text-center">
                    <div className="flex justify-center items-center space-x-1">
                      <div className="flex flex-col space-y-3">
                        <form action={updateCartItemAmountAction}>
                          <input
                            type="number"
                            name="sciId"
                            value={item.sci_id}
                            readOnly
                            hidden
                          />
                          <input name="direction" value="+" readOnly hidden />
                          <Button
                            disabled={item.sci_amount > 100_000}
                            variant="secondary"
                            size="icon"
                            className="w-6 h-6"
                          >
                            <Plus size={12} />
                          </Button>
                        </form>
                        <div>{item.sci_amount}</div>
                        <form action={updateCartItemAmountAction}>
                          <input
                            readOnly
                            hidden
                            type="number"
                            name="sciId"
                            value={item.sci_id}
                          />
                          <input readOnly hidden name="direction" value="-" />
                          <Button
                            disabled={item.sci_amount <= 1}
                            type="submit"
                            variant="secondary"
                            size="icon"
                            className="w-6 h-6"
                          >
                            <Minus size={12} />
                          </Button>
                        </form>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-medium text-center">
                    <span className="text-muted-foreground">&#36;</span>
                    {formatter.format(
                      item.sci_amount * (item.p_price_usd ?? 0)
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <form action={removeCartItemAction}>
                      <input
                        readOnly
                        hidden
                        type="number"
                        name="sciId"
                        value={item.sci_id}
                      />
                      <Button
                        className="w-8 h-8"
                        size="icon"
                        variant="destructive"
                      >
                        <Trash size={16} />
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="w-full flex justify-between">
          <div>Total: ?</div>
          <Button variant="default">Purchase</Button>
        </CardFooter>
      </Card>
      {/* <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.sci_id}>
            <div className="flex items-center space-x-4">
              <Image
                src={item.p_image}
                alt={`${item.p_name} image`}
                width={96}
                height={96}
              />
              <div className="flex-grow flex">
                <div className="flex-grow">
                  <div className="text-2xl font-bold tracking-tight flex-grow">
                    {item.p_name}
                  </div>
                  {item.p_price_usd !== null ? (
                    <div className="textl-2xl text-muted-foreground flex-grow">
                      {`$${item.p_price_usd}`}
                    </div>
                  ) : null}
                </div>
                <div>
                  <Label>Amount</Label>
                  <Input
                    className="w-20"
                    type="number"
                    value={item.sci_amount}
                  />
                </div>
              </div>
              <div className="w-24">
                <div>Total:</div>
                <div>${item.sci_amount * (item.p_price_usd ?? 0)}</div>
              </div>
              <form>
                <Button size="icon">
                  <Trash size={20} />
                </Button>
              </form>
            </div>
          </li>
        ))}
      </ul> */}
      {/* <div className="mt-8">{JSON.stringify(items, undefined, 4)}</div> */}
    </div>
  );
}
