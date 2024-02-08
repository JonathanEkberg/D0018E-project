"use server";

import { pool } from "@/lib/database";
import { getUser } from "@/lib/user";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function refreshProducts() {
  revalidatePath("/");
}

export async function addToCartAction(formData: FormData) {
  const productId = formData.get("productId");

  if (!productId) {
    throw new Error("Missing product id");
  }

  const user = getUser();

  if (!user) {
    throw new Error("You must be logged in to add to cart!");
  }

  // 1. Check if product exists
  const data = await pool.execute("SELECT id FROM product WHERE id=?", [
    productId,
  ]);

  const id = data[0] as [{ id: number }] | [];

  if (!id) {
    throw new Error("Could not find product");
  }

  await pool.execute(
    `INSERT INTO shopping_cart_item (user_id, product_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE amount = amount + 1;`,
    [user.id, productId]
  );
  revalidatePath(`/products/${productId}`);
  revalidateTag("cart-items");
}

export async function updateCartItemAmountAction(formData: FormData) {
  const user = getUser();

  if (!user) {
    throw new Error("You must be logged in!");
  }

  const [cartItemId, direction] = [
    formData.get("sciId"),
    formData.get("direction"),
  ];

  console.log(cartItemId, direction);
  if (!cartItemId || !direction) {
    throw new Error("Failed to update");
  }

  const sciId = parseInt(cartItemId.toString());

  if (!Number.isSafeInteger(sciId)) {
    throw new Error("Invalid shopping cart item ID");
  }

  // 1. Check if cart item exists
  const data = await pool.execute(
    "SELECT id FROM shopping_cart_item WHERE id=?",
    [sciId]
  );

  const id = data[0] as [{ id: number }] | [];

  if (!id[0]?.id) {
    throw new Error("Could not find product");
  }

  await pool.execute(
    `UPDATE shopping_cart_item SET amount = amount ${
      direction === "+" ? "+" : "-"
    } 1 WHERE id = ?;`,
    [id[0].id]
  );
  revalidateTag("cart-items");
}

export async function removeCartItemAction(formData: FormData) {
  const user = getUser();

  if (!user) {
    throw new Error("You must be logged in!");
  }

  const cartItemId = formData.get("sciId");

  if (!cartItemId) {
    throw new Error("Failed to update");
  }

  const sciId = parseInt(cartItemId.toString());

  if (!Number.isSafeInteger(sciId)) {
    throw new Error("Invalid shopping cart item ID");
  }

  // 1. Check if cart item exists
  await pool
    .execute("DELETE FROM shopping_cart_item WHERE id=?", [sciId])
    .catch((e) => {});
  revalidateTag("cart-items");
}

export async function logoutAction() {
  "use server";
  cookies().delete("u_id");
  cookies().delete("u_name");
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
  await pool.execute("DELETE FROM product WHERE true;");

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
      `https://d0018e.aistudybuddy.se/eggs/egg-${eggs.findIndex(
        (val) => val === egg
      )}.jpeg`
    );
  }
  await pool.execute(sql, values);
  revalidateTag("products");
  revalidatePath("/");
}
