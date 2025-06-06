import { getSessionData } from "@/actions/auth-action";
import { Skeleton } from "@/components/ui/skeleton";
import UserCard from "@/components/user-card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

function serializeForClient<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export default async function ProfilePage() {
  const { session, activeSessions, isAuthenticated } = await getSessionData();

  if (!isAuthenticated) {
    redirect("/auth/sign-in");
  }
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {" "}
        <Suspense fallback={<ProfileSkeleton />}>
          <UserCard
            session={serializeForClient(session)}
            activeSessions={serializeForClient(activeSessions)}
          />
        </Suspense>
      </div>
    </div>
  );
}

// Componente de loading
function ProfileSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="h-64" />
    </div>
  );
}
