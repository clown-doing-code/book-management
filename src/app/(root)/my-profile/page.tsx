import { getSessionData } from "@/actions/auth-action";
import { Skeleton } from "@/components/ui/skeleton";
import UserCard from "@/components/user-card";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

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
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6">
      {/* Profile Card Skeleton */}
      <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-sm dark:from-gray-900 dark:to-gray-800/50">
        <CardHeader className="pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Avatar skeleton */}
              <Skeleton className="mx-auto h-20 w-20 rounded-full sm:mx-0 sm:h-16 sm:w-16" />
              <div className="space-y-2 text-center sm:text-left">
                {/* Name skeleton */}
                <Skeleton className="mx-auto h-7 w-48 sm:mx-0 sm:h-6" />
                {/* Email skeleton */}
                <Skeleton className="mx-auto h-4 w-56 sm:mx-0" />
                {/* Verification badge skeleton */}
                <div className="flex justify-center sm:justify-start">
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>
              </div>
            </div>
            <div className="flex justify-center sm:justify-end">
              {/* Edit button skeleton */}
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Email verification alert skeleton (conditionally shown) */}
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Skeleton className="h-4 w-4 flex-shrink-0 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-3 h-8 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active sessions skeleton */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Session items skeleton */}
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700 dark:bg-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 flex-shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-8 w-20 sm:w-16" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions skeleton */}
      <Card className="shadow-sm">
        <CardFooter className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-full sm:w-32" />
          <Skeleton className="h-9 w-full sm:w-28" />
        </CardFooter>
      </Card>
    </div>
  );
}
