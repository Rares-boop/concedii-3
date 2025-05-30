// utils/fetch-allUsers.ts
export async function getAllUsers() {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) throw new Error("Not authenticated");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/users`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error fetching users: ${errorText}`);
  }

  return await res.json(); // returns list of users
}
