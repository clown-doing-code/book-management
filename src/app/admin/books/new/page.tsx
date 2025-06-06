import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewBookPage() {
  return (
    <>
      <Button variant="secondary" className="w-fit" asChild>
        <Link href="/admin/books">
          <ChevronLeft className="size-4" />
          Volver
        </Link>
      </Button>
      <section className="w-full">
        <Card>
          <CardHeader className="items-center justify-between gap-y-4 md:flex">
            <div>
              <CardTitle>Agregar un libro nuevo</CardTitle>
              <CardDescription>
                Completa todos los campos para agregar un libro nuevo al
                catálogo
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-7 w-full overflow-hidden">Book Form</div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
