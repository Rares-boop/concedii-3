

export async function getAllLeaveDays() {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) throw new Error("No token found");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/users?populate=leave_days`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error fetching users: ${res.status} - ${errorText}`);
  }

  const users = await res.json();
  return users; 
}
