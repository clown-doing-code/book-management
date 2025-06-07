"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Pipette, Loader2 } from "lucide-react";
import config from "@/lib/config";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface EyeDropperProps {
  imageUrl: string;
  onColorPicked: (color: string) => void;
  className?: string;
  buttonLabel?: string;
  loadingLabel?: string;
  modalTitle?: string;
}

const EyeDropper: React.FC<EyeDropperProps> = ({
  imageUrl,
  onColorPicked,
  className = "",
  buttonLabel = "Extraer color",
  loadingLabel = "Cargando...",
  modalTitle = "Extraer color de la imagen",
}) => {
  const [isActive, setIsActive] = useState(false);
  const [previewColor, setPreviewColor] = useState<string>("#000000");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const rgbToHex = useCallback((r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }, []);

  const getFullImageUrl = useCallback((path: string): string => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${config.env.imagekit.urlEndpoint}/${path}`;
  }, []);

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !isActive) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = Math.floor((event.clientX - rect.left) * scaleX);
      const y = Math.floor((event.clientY - rect.top) * scaleY);

      try {
        const imageData = ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = imageData.data;

        const hexColor = rgbToHex(r, g, b);
        onColorPicked(hexColor);
        setIsActive(false);
      } catch (error) {
        setError("No se pudo extraer el color. Inténtalo de nuevo.");
        console.error("Error al extraer color:", error);
      }
    },
    [isActive, onColorPicked, rgbToHex],
  );

  const handleCanvasMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !isActive) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = Math.floor((event.clientX - rect.left) * scaleX);
      const y = Math.floor((event.clientY - rect.top) * scaleY);

      setCursorPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });

      try {
        const imageData = ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = imageData.data;
        const hexColor = rgbToHex(r, g, b);
        setPreviewColor(hexColor);
      } catch (error) {
        console.warn("Error al obtener el color:", error);
      }
    },
    [isActive, rgbToHex],
  );

  const loadImageToCanvas = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !isImageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const img = imageRef.current;

    if (!ctx) return;

    try {
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      ctx.drawImage(img, 0, 0);
      setError(null);
    } catch (error) {
      setError("No se pudo cargar la imagen en el lienzo.");
      console.error("Error al cargar la imagen en el lienzo:", error);
    }
  }, [isImageLoaded]);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
    setError(null);
  }, []);

  const handleImageError = useCallback((error: any) => {
    console.error("Error al cargar la imagen:", error);
    setIsImageLoaded(false);
    setError(
      "No se pudo cargar la imagen. Verifica la URL e inténtalo de nuevo.",
    );
  }, []);

  const activateEyeDropper = useCallback(() => {
    if (!isImageLoaded) {
      setError("La imagen aún no se ha cargado completamente.");
      return;
    }
    setIsActive(true);
    setError(null);
  }, [isImageLoaded]);

  const deactivateEyeDropper = useCallback(() => {
    setIsActive(false);
    setPreviewColor("#000000");
  }, []);

  useEffect(() => {
    if (isActive && isImageLoaded) {
      const timer = setTimeout(() => {
        loadImageToCanvas();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isActive, isImageLoaded, loadImageToCanvas]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isActive && e.key === "Escape") {
        deactivateEyeDropper();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, deactivateEyeDropper]);

  const fullImageUrl = getFullImageUrl(imageUrl);

  return (
    <div className={className}>
      {imageUrl && (
        <img
          ref={imageRef}
          src={fullImageUrl || "/placeholder.svg"}
          alt="Origen del selector de color"
          className="hidden"
          onLoad={handleImageLoad}
          onError={handleImageError}
          crossOrigin="anonymous"
        />
      )}

      <Button
        type="button"
        onClick={activateEyeDropper}
        disabled={!imageUrl || !isImageLoaded}
        variant="outline"
        size="sm"
        className={`inline-flex items-center gap-2 ${
          !imageUrl || !isImageLoaded ? "cursor-not-allowed opacity-50" : ""
        }`}
        aria-label={!isImageLoaded && imageUrl ? loadingLabel : buttonLabel}
        title={!isImageLoaded && imageUrl ? loadingLabel : buttonLabel}
      >
        {!isImageLoaded && imageUrl ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Pipette className="h-3 w-3" />
        )}
        <span>{!isImageLoaded && imageUrl ? loadingLabel : buttonLabel}</span>
      </Button>

      <Dialog
        open={isActive}
        onOpenChange={(open) => !open && deactivateEyeDropper()}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>

          <div className="relative" ref={containerRef}>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mb-4 flex items-center gap-3">
              <div
                className="h-8 w-8 rounded border shadow-sm"
                style={{ backgroundColor: previewColor }}
                aria-label={`Vista previa del color: ${previewColor}`}
              />
              <span className="font-mono text-sm" aria-live="polite">
                {previewColor}
              </span>
            </div>

            <div className="relative overflow-hidden rounded-md border">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                className="max-h-[60vh] max-w-full cursor-crosshair"
                style={{ maxWidth: "100%" }}
                aria-label="Lienzo del selector de color"
                role="application"
                tabIndex={0}
              />

              {isActive && (
                <div
                  className="pointer-events-none absolute z-10 h-12 w-12 rounded-full border-2 border-white shadow-lg"
                  style={{
                    left: `${cursorPosition.x - 24}px`,
                    top: `${cursorPosition.y - 24}px`,
                    backgroundColor: previewColor,
                    transform: "translate(12px, 12px)",
                  }}
                />
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Haz clic en cualquier parte de la imagen para seleccionar ese color
          </p>
          <DialogFooter className="flex items-center justify-between">
            <Button onClick={deactivateEyeDropper} variant="outline">
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EyeDropper;
