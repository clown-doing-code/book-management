"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { adminSideBarLinks } from "@/constants";

// Mapa de rutas para nombres personalizados (opcional)
const routeNames = {
  "/admin": "Inicio",
  "/admin/users": "Usuarios",
  "/admin/books": "Catálogo de libros",
  "/admin/books/new": "Agregar libro",
  "/admin/book-requests": "Solicitudes de préstamo",
  "/admin/account-requests": "Solicitudes de registro",
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Función para obtener el nombre de la ruta
  const getRouteName = (path: string) => {
    // Primero busca en routeNames personalizados
    if (routeNames[path as keyof typeof routeNames]) {
      return routeNames[path as keyof typeof routeNames];
    }

    // Luego busca en adminSideBarLinks
    const sidebarLink = adminSideBarLinks.find((link) => link.url === path);
    if (sidebarLink) {
      return sidebarLink.name;
    }

    // Fallback: convierte el path a un nombre legible
    const segments = path.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      ? lastSegment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "Home";
  };

  // Función para generar breadcrumbs basado en el path
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter(Boolean);

    const breadcrumbs = pathSegments.map((segment, index) => {
      const path = "/" + pathSegments.slice(0, index + 1).join("/");
      const name = getRouteName(path);
      const isLast = index === pathSegments.length - 1;

      return {
        name,
        path,
        isLast,
      };
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Si estamos en /admin (root), mostrar solo "Dashboard"
  if (pathname === "/admin") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Inicio</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home/Dashboard link */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">Inicio</BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.length > 1 && (
          <>
            <BreadcrumbSeparator />
            {breadcrumbs.slice(1).map((breadcrumb, index) => (
              <div key={breadcrumb.path} className="flex items-center">
                <BreadcrumbItem>
                  {breadcrumb.isLast ? (
                    <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={breadcrumb.path}>
                      {breadcrumb.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!breadcrumb.isLast && <BreadcrumbSeparator />}
              </div>
            ))}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
