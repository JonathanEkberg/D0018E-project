"use server";

import { revalidatePath } from "next/cache";

export async function refreshProducts() {
  revalidatePath("/");
}
