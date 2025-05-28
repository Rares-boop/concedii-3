
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
  id: string;
  email: string;
  jwt: string; 
  href?: string; 
  isExternal?: boolean;
  role?: {name: string}; 
  image?: { url: string }; 
  leaveDays?: LeaveDays[];
}

export enum RequestStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export interface LeaveDays {
  firstDay: string;
  lastDay: string;
  addedAt: string;
  statusRequest: RequestStatus;
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

export interface PublicHolidays{
  holidayName: string;
  date: string;
}