"use client";

import type React from "react";

import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import config from "@/lib/config";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { File, ImageIcon, Video, CheckCircle, X } from "lucide-react";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();

    const { signature, expire, token } = data;

    return { token, expire, signature };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const styles = {
    button:
      variant === "dark"
        ? "bg-muted border-amber-100 "
        : "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:from-gray-50 hover:to-gray-100",
    placeholder: variant === "dark" ? "text-amber-100" : "text-amber-100",
    text: variant === "dark" ? "text-white" : "text-white",
    accent: variant === "dark" ? "text-amber-100" : "text-amber-200",
  };

  const onError = (error: any) => {
    console.log(error);
    setIsUploading(false);
    setProgress(0);

    toast.error(`Error al subir ${type}`, {
      description: `Tu ${type} no se pudo subir. Por favor, inténtalo de nuevo.`,
    });
  };

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);
    setIsUploading(false);
    setProgress(100);

    toast.success(`${type} subido exitosamente`, {
      description: `¡${res.filePath} se subió correctamente!`,
    });

    // Reiniciar progreso después de un retraso
    setTimeout(() => setProgress(0), 2000);
  };

  const onValidate = (file: File) => {
    if (type === "image") {
      if (file.size > 20 * 1024 * 1024) {
        toast.error("Archivo demasiado grande", {
          description: "Por favor, sube un archivo de menos de 20MB.",
        });
        return false;
      }
    } else if (type === "video") {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Archivo demasiado grande", {
          description: "Por favor, sube un archivo de menos de 50MB.",
        });
        return false;
      }
    }
    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (ikUploadRef.current) {
      // @ts-ignore
      ikUploadRef.current?.click();
    }
  };

  const removeFile = () => {
    setFile({ filePath: null });
    onFileChange("");
    setProgress(0);
  };

  const getFileIcon = () => {
    if (type === "image") return <ImageIcon className="h-4 w-4" />;
    if (type === "video") return <Video className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <div className="w-full space-y-4">
        <IKUpload
          ref={ikUploadRef}
          onError={onError}
          onSuccess={onSuccess}
          useUniqueFileName={true}
          validateFile={onValidate}
          onUploadStart={() => {
            setProgress(0);
            setIsUploading(true);
          }}
          onUploadProgress={({ loaded, total }) => {
            const percent = Math.round((loaded / total) * 100);
            setProgress(percent);
          }}
          folder={folder}
          accept={accept}
          className="hidden"
        />

        {/* Upload Button */}
        <div
          className={cn(
            "relative overflow-hidden rounded-lg border-2 border-dashed transition-all duration-300 ease-in-out",
            styles.button,
            isDragOver && "scale-[1.02] border-amber-400 bg-muted",
            isUploading && "pointer-events-none",
            file?.filePath && "border-solid",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <button
            className="flex min-h-12 w-full flex-col items-center justify-center gap-2 p-3 transition-all duration-200 hover:scale-[1.01]"
            onClick={(e) => {
              e.preventDefault();
              if (ikUploadRef.current && !isUploading) {
                // @ts-ignore
                ikUploadRef.current?.click();
              }
            }}
            disabled={isUploading}
          >
            {/* Icon */}
            <div
              className={cn(
                "flex items-center justify-center rounded-full p-2 transition-all duration-300",
                variant === "dark" ? "bg-slate-700/50" : "bg-gray-100",
                styles.accent,
                isUploading && "animate-pulse",
              )}
            >
              {isUploading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : file?.filePath ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                getFileIcon()
              )}
            </div>

            <div className="space-y-0.5 text-center">
              <p className={cn("text-sm font-medium", styles.placeholder)}>
                {isUploading
                  ? "Subiendo..."
                  : file?.filePath
                    ? "¡Subida completada!"
                    : placeholder}
              </p>
              <p className={cn("text-[10px]", styles.text)}>
                {isUploading
                  ? "Por favor espera mientras procesamos tu archivo"
                  : file?.filePath
                    ? "Haz clic para subir otro archivo"
                    : `Arrastra y suelta tu ${type} aquí, o haz clic para buscar`}
              </p>
            </div>
          </button>

          {/* Remove button for uploaded files */}
          {file?.filePath && !isUploading && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className={cn(
                "absolute top-2 right-2 rounded-full bg-muted p-1 text-white transition-all duration-200 hover:scale-110 hover:bg-amber-100/60",
              )}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Enhanced Progress Bar */}
        {progress > 0 && progress < 100 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className={styles.text}>Subiendo...</span>
              <span className={cn("font-semibold", styles.accent)}>
                {progress}%
              </span>
            </div>
            <div
              className={cn(
                "h-1.5 w-full overflow-hidden rounded-full",
                variant === "dark" ? "bg-slate-700" : "bg-gray-200",
              )}
            >
              <div
                className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
          </div>
        )}

        {/* Success Progress Bar */}
        {progress === 100 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-1 font-medium text-green-600">
                <CheckCircle className="h-3 w-3" />
                Subida completada
              </span>
              <span className="font-semibold text-green-600">100%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-green-100">
              <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-green-500 to-green-600" />
            </div>
          </div>
        )}

        {/* File Preview */}
        {file?.filePath && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className={cn("font-medium", styles.text)}>Vista Previa</h4>
            </div>

            {type === "image" && (
              <div className="relative max-h-32 overflow-hidden rounded-md border">
                <IKImage
                  path={file.filePath}
                  width={500}
                  height={300}
                  loading={"eager"}
                  alt={file.filePath}
                  className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </ImageKitProvider>
  );
};

export default FileUpload;
