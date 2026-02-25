import SuppliersClient from "@/components/Protected/Suppliers/SuppliersClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suppliers | LumaG Genius AI",
  description: "Manage suppliers and track price changes",
};

export default function SuppliersPage() {
  return <SuppliersClient />;
}
