import { pool } from "@/lib/database";
import { revalidatePath, revalidateTag } from "next/cache";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

async function createProduct(formData: FormData) {
  "use server";
  const name = formData.get("name")!.toString();
  const description = formData.get("description")!.toString();
  const image = formData.get("image")!.toString();
  const price = formData.get("price_usd")!.toString();
  const stock = formData.get("stock")!.toString();
  const values = [name, description, image, price, stock];
  console.log("Creating product with values:", values);

  const result = await pool.execute(
    `INSERT INTO product (name, description, image, price_usd, stock) VALUES(?, ?, ?, ?, ?);`,
    values
  );
  const value = result[0];
  console.log(value);
  revalidateTag("products");
  revalidatePath("/");
  redirect("/");
}

interface CreateProductProps {}

export function CreateProduct({}: CreateProductProps) {
  return (
    // <Card className="bg-zinc-900 p-6 rounded-md w-full">
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create product</CardTitle>
        <CardDescription>Add more products for us to sell.</CardDescription>
      </CardHeader>
      <form action={createProduct}>
        <CardContent className="space-y-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Name of the product"
              required
              defaultValue={
                process.env.NODE_ENV === "development" ? "Ägg" : undefined
              }
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Product description"
              required
              defaultValue={
                process.env.NODE_ENV === "development"
                  ? "Färdig knäckt ägg för hela familjen"
                  : undefined
              }
            />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              name="image"
              placeholder="Image URL"
              required
              defaultValue={
                process.env.NODE_ENV === "development"
                  ? "https://d0018e.aistudybuddy.se/eggs/egg-12.jpeg"
                  : undefined
              }
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="price_usd">Price</Label>
              <Input
                id="price_usd"
                name="price_usd"
                placeholder="Price in USD"
                required
                type="number"
                defaultValue={
                  process.env.NODE_ENV === "development" ? 8 : undefined
                }
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                placeholder="Stock"
                required
                type="number"
                defaultValue={
                  process.env.NODE_ENV === "development" ? 123 : undefined
                }
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit">Create</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
