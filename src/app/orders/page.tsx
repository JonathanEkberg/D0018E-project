import { unstable_cache } from "next/cache";
import { pool } from "@/lib/database";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { DollarFormatter } from "@/components/DollarFormatter";
import Link from "next/link";
import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";
import { deleteOrderAction } from "../actions";
import { Badge } from "@/components/ui/badge";

const getOrders = unstable_cache(
  async (id: number) => {
    const data = await pool.execute(
      `SELECT order.id, order.delivered, order_item.amount, order_item.product_id, order_item.price_usd, product.name
      FROM \`order\`
      INNER JOIN order_item ON order.id = order_item.order_id
      INNER JOIN product ON order_item.product_id = product.id
      WHERE user_id = ?;`,
      [id]
    );

    const orderItems = data[0] as {
      id: number;
      delivered: boolean;
      amount: number;
      product_id: number;
      price_usd: string;
      name: string;
    }[];

    const orders: Record<string, typeof orderItems> = {};
    for (const item of orderItems) {
      const key = String(item.id);
      if (!(key in orders)) {
        orders[key] = [];
      }

      orders[key].push(item);
    }
    return orders;
  },
  ["orders"],
  { tags: ["orders"], revalidate: 30 }
);

export default async function OrderPage() {
  const user = getUser();

  if (!user) {
    return redirect("/");
  }

  const orders = await getOrders(user.id);
  console.log(orders);
  //   const orders: {
  //     order_id: number;
  //     items: string[];
  //     total: number;
  //   }[] = [{ order_id: 69, items: ["Gud", "Holy Grail"], total: 2000 }];
  return (
    <div className="max-w-2xl w-full mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left w-24">Order</TableHead>
            <TableHead className="text-left w-24">Status</TableHead>
            <TableHead className="text-center w-24">Total</TableHead>
            <TableHead className="text-left w-full">Items</TableHead>
            <TableHead className="text-right">Manage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(orders).map(([orderId, items]) => (
            <TableRow key={orderId}>
              <TableCell className="font-medium flex items-center space-x-4">
                <div>{orderId}</div>
              </TableCell>

              <TableCell>
                <div>
                  {Boolean(items.at(0)?.delivered) === true ? (
                    <Badge className="bg-green-500 text-white">Delivered</Badge>
                  ) : (
                    <Badge className="bg-blue-500 text-white">Processing</Badge>
                  )}
                </div>
              </TableCell>

              <TableCell className="font-medium">
                <DollarFormatter
                  value={items
                    .map((item) => Number(item.price_usd))
                    .reduce((total, curr) => total + curr)}
                />
              </TableCell>
              <TableCell className="font-medium">
                {items
                  .map((item) => ({
                    id: item.product_id,
                    name: item.name,
                  }))
                  .map((product, idx) => (
                    <span key={product.id}>
                      <Link
                        className="underline"
                        href={`/products/${product.id}`}
                      >
                        {product.name}
                      </Link>
                      <span>{idx !== items.length - 1 && ", "}</span>
                    </span>
                  ))}
              </TableCell>

              <TableCell className="text-right flex space-x-2 w-full flex-end">
                {/* <form action={removeCartItemAction}> */}
                <input
                  readOnly
                  hidden
                  type="number"
                  name="sciId"
                  // value={item.sci_id}
                />
                <Button>
                  <Link href={`/orders/${orderId}`}>View</Link>
                </Button>
                <form action={deleteOrderAction}>
                  <input name="orderId" readOnly hidden value={orderId} />
                  <Button
                    disabled={items.at(0)?.delivered}
                    // className="w-10 h-10"
                    // size="icon"
                    variant="destructive"
                    type="submit"
                  >
                    Cancel
                    {/* <Trash size={16} /> */}
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
