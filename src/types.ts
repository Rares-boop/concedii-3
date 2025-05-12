
export interface Logo {
  logoText: string;
  image: { url: string };
}

export interface Link {
  text: string;
  href: string;
  isExternal: boolean;
}

{/* export interface User {
  email: string;
  href: string;
  isExternal: boolean;
  image: { url: string };
} */}

export interface User {
  email: string;
  jwt: string; // ✅ Stores authentication token
  href?: string; // Mark href as optional, unless required
  isExternal?: boolean; // Optional external flag
  image?: { url: string }; // Optional image data
}

export interface Header {
  logo: Logo;
  link: Link;
  user: User;
}

export interface Footer {
  logo: Logo;
  description: string;
  date: string;
}