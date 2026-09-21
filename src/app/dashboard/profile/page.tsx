import { redirect } from "next/navigation";

import { Avatar } from "@/components/atoms/Avatar";
import { Container } from "@/components/atoms/Container";
import { PageHeading } from "@/components/molecules/PageHeading";
import { ProfileField } from "@/components/molecules/ProfileField";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export const metadata = { title: "Profile — StoxVira" };

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // The session cookie carries name and email but not when the account was
  // made, so that one field comes from the database.
  await connectToDatabase();
  const user = await User.findById(session.userId).lean();

  if (!user) {
    // The cookie outlived the account — treat it as signed out.
    redirect("/login");
  }

  return (
    <Container className="pt-8">
      <PageHeading title="Profile" meta="YOUR ACCOUNT" />

      <div className="flex items-center gap-4 pt-7 pb-2">
        <Avatar name={user.name} size="lg" className="bg-brand-tint text-brand" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-lg font-medium text-ink">{user.name}</span>
          <span className="truncate font-mono text-label text-muted">
            {user.email}
          </span>
        </div>
      </div>

      <div className="max-w-[640px] pt-4">
        <ProfileField label="FULL NAME" value={user.name} />
        <ProfileField
          label="EMAIL"
          value={user.email}
          hint={
            user.emailVerified
              ? undefined
              : "Not verified — email confirmation is not live yet."
          }
        />
        <ProfileField
          label="MEMBER SINCE"
          value={formatJoined(user.createdAt)}
        />
      </div>
    </Container>
  );
}

function formatJoined(date: Date | undefined): string {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
}
