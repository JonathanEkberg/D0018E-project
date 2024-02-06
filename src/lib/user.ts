import { cookies } from "next/headers";

function resetUserCookies() {
  cookies().delete("u_id");
  cookies().delete("u_name");
}

export function getUser(): { id: number; name: string } | null {
  const [id, name] = [cookies().get("u_id"), cookies().get("u_name")];

  if (!id || !name) {
    return null;
  }

  const parsed = parseInt(id.value);

  if (Number.isNaN(parsed)) {
    resetUserCookies();
    return null;
  }

  return { id: parsed, name: name.value };
}
