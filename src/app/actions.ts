"use server";

import { createDb } from "@/lib/database";
import { revalidatePath } from "next/cache";

export async function refreshProducts() {
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

export async function resetDatabase(formData: FormData) {
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
  await db.execute(sql, values);
  db.destroy();
  revalidatePath("/");
}
