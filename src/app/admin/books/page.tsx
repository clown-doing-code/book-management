import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

export default function BooksPage({}: Props) {
  return (
    <section className="w-full">
      <Card>
        <CardHeader className="items-center justify-between gap-y-4 md:flex">
          <div>
            <CardTitle>Catálogo de Libros</CardTitle>
            <CardDescription>
              Desde aquí puedes agregar libros nuevos al catálogo.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/books/new">
              Agregar Libros <Plus className="size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mt-7 w-full overflow-hidden">Table</div>
        </CardContent>
      </Card>
    </section>
  );
}
