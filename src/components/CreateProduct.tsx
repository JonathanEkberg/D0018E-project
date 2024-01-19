import { createDb } from "@/lib/database";
import { revalidatePath } from "next/cache";
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
import { AlertTriangle, Biohazard, Skull, SkullIcon } from "lucide-react";

async function createProduct(formData: FormData) {
  "use server";
  const name = formData.get("name")!.toString();
  const description = formData.get("description")!.toString();
  const image = formData.get("image")!.toString();
  const values = [name, description, image];
  console.log("Creating product with values:", values);

  const db = await createDb();
  const result = await db.execute(
    `INSERT INTO product (name, description, image) VALUES(?, ?, ?);`,
    values
  );
  db.destroy();
  const value = result[0];
  console.log(value);
  revalidatePath("/");
}

const eggs: string[] = [
  "Intergalactical",
  "Blue",
  "Gold",
  "Disco",
  "Chernobyl",
  "Fade",
  "Willys",
  "Apple",
  "The Last of Us",
  "Sir",
  "Hawaii",
  "Holy Grail",
  "Vanilla",
  "Pre cracked",
  "Pride",
  "Black",
  "Bullet Proof",
  "Kitsch",
  "Milkyway",
  "International",
  "Delicacy",
  "Probiotic",
  "Koh-i-Noor",
  "Rolex",
  "Fabergé",
  "Påsk",
];

async function resetDatabase(formData: FormData) {
  "use server";
  const db = await createDb();
  await db.query("DELETE FROM product WHERE true;");

  // "sort" is in-place so make a copy
  const random = [...eggs].sort(() => Math.random() * 2 - 1);
  const sql = `
INSERT INTO product (name, description, image) VALUES
${random.map(() => "  (?, ?, ?)").join(",\n")};`;
  const values: string[] = [];
  for (let i = 0; i < random.length; i++) {
    const egg = random[i];
    values.push(
      egg,
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      `http://ec2-51-20-18-194.eu-north-1.compute.amazonaws.com:3000/eggs/egg-${eggs.findIndex(
        (val) => val === egg
      )}.jpeg`
    );
  }
  // console.log(sql);
  // console.log(values);
  const result = await db.execute(sql, values);
  // console.log(result);
  db.destroy();
  const value = result[0];
  // console.log(value);
  revalidatePath("/");
}

interface CreateProductProps {}

export async function CreateProduct({}: CreateProductProps) {
  //   const db = await createDb();
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
              placeholder="Description"
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
                  ? "http://ec2-51-20-18-194.eu-north-1.compute.amazonaws.com:3000/eggs/egg-12.jpeg"
                  : undefined
              }
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            formAction={resetDatabase}
            variant="destructive"
            type="submit"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button type="submit">Create</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
