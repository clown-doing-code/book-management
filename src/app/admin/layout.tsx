import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { getSessionData } from "@/actions/auth-action";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";
import AdminHeader from "@/components/admin/admin-header";
import { DynamicBreadcrumb } from "@/components/admin/dynamic-breadcrumb";

export default async function AdminLayoyt({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await getSessionData();

  if (!session?.user?.id) redirect("/auth/sign-in");

  // const isAdmin = await db
  //   .select({ isAdmin: users.role })
  //   .from(users)
  //   .where(eq(users.id, session.user.id))
  //   .limit(1)
  //   .then((res) => res[0]?.isAdmin === "ADMIN");

  // if (!isAdmin) redirect("/");
  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2 px-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <AdminHeader session={session} />

          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
