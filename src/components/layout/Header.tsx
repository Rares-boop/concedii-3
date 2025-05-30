"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getHeaderData } from "@/utils/fetch-header";
import { Header as HeaderType, User } from "@/types";
import { StrapiImage } from "@/components/StrapiImage";
import { fetchApi } from "@/utils/fetch-api";

export default function Header() {
  const router = useRouter();
  const [header, setHeader] = useState<HeaderType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null
  );

  useEffect(() => {
    const updateAuthState = () => {
      setJwt(localStorage.getItem("jwt"));
    };

    window.addEventListener("authUpdated", updateAuthState);
    return () => window.removeEventListener("authUpdated", updateAuthState);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const { header: headerData } = await getHeaderData();
        setHeader(headerData);

        if (jwt) {
          const userData = await fetchApi("users/me?populate=role", {
            headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
          });
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        setError("Failed to fetch header data");
        console.error("❌ Error:", err);
      }
    }

    fetchData();
  }, [jwt]);

  function handleLogout() {
    localStorage.removeItem("jwt");
    setUser(null);
    window.dispatchEvent(new Event("authUpdated"));
    router.push("/login");
  }

  if (error) return <p className="text-red-600 font-bold">{error}</p>;
  if (!header) return null;

  return (
    <header className="bg-slate-800 text-white px-6 py-3 shadow flex justify-between items-center">
      {/* Left: Logo and Navigation */}
      <div className="flex items-center gap-6">
        {header.logo?.image?.url && (
          <Link href="/" className="flex items-center gap-3">
            <StrapiImage
              src={header.logo.image.url}
              alt={header.logo.logoText || "Logo"}
              width={64}
              height={48}
              className="h-12 w-16 object-cover rounded-md"
            />
          </Link>
        )}

        {/* Main link (concedii) */}
        {header.link?.href && (
          <Link
            href={header.link.href}
            target={header.link.isExternal ? "_blank" : "_self"}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold shadow transition"
          >
            {header.link.text || "concedii"}
          </Link>
        )}

        {/* Admin buttons match "concedii" style */}
        {user?.role?.name === "Admin" && (
          <>
            <Link
              href="/admin"
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold shadow transition"
            >
              Admin Panel
            </Link>
            <Link
              href="/zile-libere"
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold shadow transition"
            >
              Zile Libere
            </Link>
          </>
        )}
      </div>

      {/* Right: User email and logout */}
      <div className="flex items-center gap-4">
        {jwt && user ? (
          <>
            <Link
              href="/user"
              className="text-sm text-gray-200 hover:text-white transition"
            >
              {user.email}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold shadow transition"
            >
              Logout
            </button>
          </>
        ) : (
          <p className="text-red-400 font-bold">❌ User not logged in!</p>
        )}
      </div>
    </header>
  );
}
