import { pool } from "@/lib/database"
import React, { Suspense, cache } from "react"
import { RefreshButton } from "../RefreshButton"
import Image from "next/image"
import { Card, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { Badge } from "../ui/badge"
import { unstable_cache } from "next/cache"
import Link from "next/link"
import { Button } from "../ui/button"
import { ProductListContent, ProductListContentLoading } from "./content"
import { getUser } from "@/lib/user"
import { PlusIcon } from "lucide-react"

// export const getProducts = unstable_cache(
export const getProducts = async () => {
  await new Promise<void>(res => setTimeout(res, 1000))
  const data = await pool.execute(
    `SELECT id, name, description, image FROM product ORDER BY created_at DESC LIMIT 10;`,
  )

  return data[0] as {
    id: number
    name: string
    description: string
    image: string
  }[]
}
// },
//   ["products"],
//   { tags: ["products"] }
// );

interface ProductListProps {}

export async function ProductList({}: ProductListProps) {
  const user = getUser()
  return (
    <div className="w-full">
      <div className="flex justify-between px-2 pb-4">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Products
        </h2>
        <div className="flex space-x-2">
          <RefreshButton />
          {user?.role === "ADMIN" && (
            <Button asChild variant="secondary">
              <Link href="/admin/create-product">
                <PlusIcon className="mr-2 h-4 w-4" />
                Create
              </Link>
            </Button>
          )}
        </div>
      </div>
      <Suspense fallback={<ProductListContentLoading />}>
        <ProductListContent />
      </Suspense>
    </div>
  )
}
