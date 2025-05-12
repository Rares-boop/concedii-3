"use client";

import { useUser } from "@/app/login/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getHeaderData } from "@/utils/fetch-header";
import { Header as HeaderType } from "@/types";
import { StrapiImage } from "@/components/StrapiImage";
import { useEffect, useState } from "react";
import { User } from "@/types";

export default function Header() {
  const userContext = useUser(); // Provides userPromise & refreshUser function
  const router = useRouter();
  const [header, setHeader] = useState<HeaderType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { header: headerData } = await getHeaderData();
        setHeader(headerData);

        // Resolve user Promise and set state
        const resolvedUser = await userContext?.userPromise;
        if (resolvedUser !== undefined) {
          setUser(resolvedUser);
        }
      } catch (err) {
        setError("Failed to fetch header data");
      }
    }
    fetchData();
  }, [userContext?.userPromise]);

  function handleLogout() {
    localStorage.removeItem("user");
    userContext?.refreshUser(); // ✅ Triggers an immediate state update
    router.push("/login");
  }

  console.log("User Context (Promise Resolved):", user); // Debugging

  if (error) return <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>;
  if (!header) return null;

  return (
    <header className="header">
      <div className="header__left">
        {/* Logo Section */}
        {header.logo?.image?.url && (
          <Link href="/" className="header__logo-link">
            <StrapiImage src={header.logo.image.url} alt={header.logo.logoText || "Logo"} width={120} height={120} />
            {header.logo.logoText && <h1>{header.logo.logoText}</h1>}
          </Link>
        )}

        {/* Navigation Link */}
        {header.link?.href && (
          <nav>
            <Link href={header.link.href} target={header.link.isExternal ? "_blank" : "_self"}>
              {header.link.text}
            </Link>
          </nav>
        )}
      </div>

      {/* Right Section (User & Logout) */}
      <div className="header__right">
        {user?.jwt && (
          <>
            <Link href="/user" className="header__user-email">{user.email}</Link>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
}
