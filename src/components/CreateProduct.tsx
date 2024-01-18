import { createDb } from "@/lib/database";
import { revalidatePath } from "next/cache";
import React from "react";

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

async function resetDatabase(formData: FormData) {
  "use server";
  const db = await createDb();
  const result = await db.query(`DELETE FROM product WHERE true;`);
  db.destroy();
  const value = result[0];
  console.log(value);
  revalidatePath("/");
}

interface CreateProductProps {}

export async function CreateProduct({}: CreateProductProps) {
  //   const db = await createDb();
  return (
    <div className="bg-zinc-900 p-6 rounded-md w-full">
      <div>Create product</div>
      <form action={createProduct} className="space-y-2">
        <div>
          <input
            className="text-black"
            name="name"
            placeholder="Name"
            required
            defaultValue="Knäckt Ägg"
          />
        </div>
        <div>
          <input
            className="text-black"
            name="description"
            placeholder="Description"
            required
            defaultValue="Färdig knäckt ägg för hela familjen"
          />
        </div>
        <div>
          <input
            className="text-black"
            name="image"
            placeholder="Image URL"
            required
            defaultValue="https://cdn.discordapp.com/attachments/1171050336878854194/1196441670552662066/p5twx7vv41971.png?ex=65b7a423&is=65a52f23&hm=183b9b1e2ae29a7eba8cf73e6565f5f09970d1be683ca6c4100fed56afc76b80&"
          />
        </div>
        <input className="bg-white text-black py-2 px-4" type="submit" />
      </form>

      <form action={resetDatabase} className="space-y-2">
        <button className="bg-white text-black py-2 px-4" type="submit">
          Reset
        </button>
      </form>
    </div>
  );
}
