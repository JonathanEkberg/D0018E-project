import { cookies } from "next/headers";

function resetUserCookies() {
  cookies().delete("u_id");
  cookies().delete("u_name");
  cookies().delete("u_role");
}

export function getUser(): {
  id: number;
  name: string;
  role: "USER" | "ADMIN";
} | null {
  const [id, name, role] = [
    cookies().get("u_id"),
    cookies().get("u_name"),
    cookies().get("u_role"),
  ];

  if (!id || !name || !role) {
    // resetUserCookies();
    return null;
  }

  const parsed = parseInt(id.value);

  if (Number.isNaN(parsed)) {
    // resetUserCookies();
    return null;
  }

  if (!["USER", "ADMIN"].includes(role.value)) {
    // resetUserCookies();
    return null;
  }

  return { id: parsed, name: name.value, role: role.value as "USER" | "ADMIN" };
}
