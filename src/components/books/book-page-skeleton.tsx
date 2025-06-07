import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookPageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Book Overview Skeleton */}
        <section className="mb-12 flex flex-col-reverse items-center gap-12 sm:gap-32 xl:flex-row xl:gap-8">
          <div className="flex flex-1 flex-col gap-6">
            <Skeleton className="h-16 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
          <div className="flex flex-1 justify-center">
            <Skeleton className="h-80 w-60" />
          </div>
        </section>

        {/* Tabs Skeleton */}
        <section>
          <div className="mb-8 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>

          <Card className="">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
