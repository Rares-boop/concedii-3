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


  // ✅ Listen for authentication updates
  useEffect(() => {
    const updateAuthState = () => {
      setJwt(localStorage.getItem("jwt")); // ✅ Updates JWT when login/logout happens
    };

    window.addEventListener("authUpdated", updateAuthState);

    return () => {
      window.removeEventListener("authUpdated", updateAuthState);
    };
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
          setUser(null); // ✅ Ensures logout clears user state
        }
      } catch (err) {
        setError("Failed to fetch header data");
        console.error("❌ Error:", err);
      }
    }

    fetchData();
  }, [jwt]); // ✅ Re-fetch when JWT changes

  function handleLogout() {
    localStorage.removeItem("jwt"); // ✅ Remove JWT
    setUser(null); // ✅ Clears user state

    window.dispatchEvent(new Event("authUpdated")); // ✅ Notify header to update
    router.push("/login");
  }

  if (error) return <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>;
  if (!header) return null;

  console.log("🔍 JWT from localStorage:", localStorage.getItem("jwt"));
  console.log("🔍 User data:", user);




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

        {/* Admin Panel Button - Styled Same as Concedii */}
        {user?.role?.name === "Admin" && (
          <Link href="/admin" className="header__button concedii-btn">
            Admin Panel
          </Link>
        )}
      </div>

      {/* Right Section (User & Logout) */}
      <div className="header__right">
        {jwt && user ? (
          <>


            <Link href="/user" className="header__user-email">{user.email}</Link>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <p style={{ color: "red", fontWeight: "bold" }}>❌ User not logged in!</p>
        )}
      </div>
    </header>
  );
}
