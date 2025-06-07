"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useState } from "react";
import {
  Loader2,
  BookOpen,
  Star,
  Upload,
  Palette,
  Video,
  FileText,
  Globe,
} from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { bookSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Book } from "types";
import FileUpload from "../file-upload";
import ColorPicker from "./color-picker";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBook } from "@/actions/add-book-action";

interface Props extends Partial<Book> {
  type?: "create" | "update";
}

const BookForm = ({ type = "create", ...book }: Props) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewData, setPreviewData] = useState<Partial<
    z.infer<typeof bookSchema>
  > | null>(null);

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book.title || "",
      description: book.description || "",
      author: book.author || "",
      genre: book.genre || "",
      rating: book.rating || 1,
      totalCopies: book.totalCopies || 1,
      coverUrl: book.coverUrl || "",
      coverColor: book.coverColor || "#3b82f6",
      videoUrl: book.videoUrl || "",
      summary: book.summary || "",
      language: book.language || "es",
    },
    mode: "onChange",
  });

  const watchedValues = form.watch();

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    const result = await createBook(values);

    if (result.success) {
      toast.success("Éxito", {
        description: "Libro creado correctamente",
      });

      router.push(`/admin/books/${result.data.id}`);
    } else {
      toast.error("Error", {
        description: result.error,
      });
    }
  };

  const handlePreview = () => {
    setPreviewData(watchedValues);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  // Opciones de idiomas
  const languageOptions = [
    { value: "es", label: "Español", flag: "🇪🇸" },
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "fr", label: "Français", flag: "🇫🇷" },
    { value: "de", label: "Deutsch", flag: "🇩🇪" },
    { value: "it", label: "Italiano", flag: "🇮🇹" },
    { value: "pt", label: "Português", flag: "🇵🇹" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <Separator />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título del libro *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa el título del libro"
                            {...field}
                            className="transition-all duration-200 focus:ring-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Autor *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nombre del autor"
                            {...field}
                            className="transition-all duration-200 focus:ring-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Género *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Ficción, Romance"
                            {...field}
                            className="transition-all duration-200 focus:ring-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Idioma *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue="es"
                        >
                          <FormControl>
                            <SelectTrigger className="w-full transition-all duration-200 focus:ring-2">
                              <SelectValue placeholder="Seleccionar idioma" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {languageOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{option.flag}</span>
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calificación *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={5}
                            placeholder="1-5"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="transition-all duration-200 focus:ring-2"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalCopies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Copias totales *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={10000}
                            placeholder="Número de copias"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="transition-all duration-200 focus:ring-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-6">
                <Separator />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="coverUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Portada del libro
                        </FormLabel>
                        <FormControl>
                          <FileUpload
                            type="image"
                            accept="image/*"
                            placeholder="Subir portada del libro"
                            folder="books/covers"
                            variant="dark"
                            onFileChange={field.onChange}
                            value={field.value}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Formatos soportados: JPG, PNG, WebP (máx. 5MB)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Tráiler del libro (opcional)
                        </FormLabel>
                        <FormControl>
                          <FileUpload
                            type="video"
                            accept="video/*"
                            placeholder="Subir tráiler del libro"
                            folder="books/videos"
                            variant="dark"
                            onFileChange={field.onChange}
                            value={field.value}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Video promocional o tráiler del libro (máx. 50MB)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-6">
                <Separator />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Descripción y Resumen - 2 columnas */}
                  <div className="space-y-6 lg:col-span-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción del libro *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descripción detallada del libro..."
                              {...field}
                              rows={8}
                              className="transition-all duration-200 focus:ring-2"
                            />
                          </FormControl>
                          <FormDescription>
                            Descripción completa que aparecerá en la página del
                            libro
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="summary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resumen del libro</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Resumen breve del libro..."
                              {...field}
                              rows={8}
                              className="transition-all duration-200 focus:ring-2"
                            />
                          </FormControl>
                          <FormDescription>
                            Resumen corto para mostrar en las tarjetas de vista
                            previa
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Color Picker - 1 columna */}
                  <div className="lg:col-span-1">
                    <FormField
                      control={form.control}
                      name="coverColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Palette className="h-4 w-4" />
                            Color primario
                          </FormLabel>
                          <FormControl>
                            <ColorPicker
                              onPickerChange={field.onChange}
                              value={field.value}
                            />
                          </FormControl>
                          <FormDescription>
                            Color que representa el libro en la interfaz
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <Separator />

              {/* Action Buttons */}
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => router.back()}
                  className="flex-1 sm:flex-none"
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {type === "create"
                    ? "Agregar libro a la biblioteca"
                    : "Actualizar libro"}
                </Button>

                {/* <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  className="flex-1 sm:flex-none"
                >
                  Vista previa
                </Button> */}
              </div>
            </form>
          </Form>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-lg border bg-background p-4">
            <h3 className="mb-4 font-semibold">Vista Previa</h3>

            {watchedValues.title || watchedValues.author ? (
              <div className="space-y-4">
                {watchedValues.coverUrl && (
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={watchedValues.coverUrl || "/placeholder.svg"}
                      alt="Portada"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="line-clamp-2 text-lg font-semibold">
                    {watchedValues.title || "Título del libro"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    por {watchedValues.author || "Autor"}
                  </p>

                  <div className="flex items-center gap-2">
                    {watchedValues.genre && (
                      <Badge variant="secondary" className="text-xs">
                        {watchedValues.genre}
                      </Badge>
                    )}
                    {watchedValues.language && (
                      <Badge variant="outline" className="text-xs">
                        <Globe className="mr-1 h-3 w-3" />
                        {
                          languageOptions.find(
                            (l) => l.value === watchedValues.language,
                          )?.flag
                        }{" "}
                        {watchedValues.language}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {renderStars(watchedValues.rating || 1)}
                    <span className="ml-1 text-sm text-muted-foreground">
                      ({watchedValues.rating || 1}/5)
                    </span>
                  </div>

                  {watchedValues.summary && (
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {watchedValues.summary}
                    </p>
                  )}

                  <div className="border-t pt-2 text-xs text-muted-foreground">
                    {watchedValues.totalCopies || 1}{" "}
                    {watchedValues.totalCopies === 1 ? "copia" : "copias"}{" "}
                    disponibles
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <BookOpen className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p className="text-sm">
                  Completa los campos para ver la vista previa
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
