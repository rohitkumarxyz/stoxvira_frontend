import { redirect } from "next/navigation";

/** Profile now lives inside the dashboard shell. Keep the old URL working. */
export default function LegacyProfilePage() {
  redirect("/dashboard/profile");
}
