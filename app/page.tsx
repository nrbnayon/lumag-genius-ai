// app/page.tsx
// This page is ONLY reached by authenticated admins.
// Unauthenticated users are redirected to /signin by proxy.ts before hitting this.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const userRole   = cookieStore.get("userRole")?.value;
  const accessToken = cookieStore.get("accessToken")?.value;

  // Authenticated admin → go to dashboard
  if (accessToken && userRole === "admin") {
    redirect("/dashboard");
  }

  // Fallback: should never be reached (proxy handles unauthenticated users),
  // but kept as a safety net.
  redirect("/signin");
}
