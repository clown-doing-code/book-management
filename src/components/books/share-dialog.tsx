"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Twitter,
  Link,
  Mail,
  MessageCircle,
  Clipboard,
  ClipboardCheckIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Icons } from "../ui/icon";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  bookAuthor: string;
}

export default function ShareDialog({
  isOpen,
  onClose,
  bookTitle,
  bookAuthor,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `¡Mira este libro increíble: "${bookTitle}" por ${bookAuthor}!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success("Enlace copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Error al copiar el enlace");
    }
  };

  const shareOptions = [
    {
      name: "Facebook",
      icon: Icons.facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: "Twitter",
      icon: Icons.X,
      color: "bg-sky-500 hover:bg-sky-600",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: "WhatsApp",
      icon: Icons.whatsapp,
      color: "bg-green-600 hover:bg-green-700",
      url: `https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`,
    },
    {
      name: "Email",
      icon: Icons.mail,
      color: "bg-gray-600 hover:bg-gray-700",
      url: `mailto:?subject=${encodeURIComponent(bookTitle)}&body=${encodeURIComponent(shareText + "\n\n" + currentUrl)}`,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Compartir Libro</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">{bookTitle}</h3>
            <p className="text-gray-400">por {bookAuthor}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => (
              <Button
                key={option.name}
                className={`${option.color} flex items-center gap-2 text-white`}
                onClick={() => window.open(option.url, "_blank")}
              >
                <option.icon className="h-4 w-4" />
                {option.name}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Copiar enlace
            </label>
            <div className="flex gap-2">
              <Input value={currentUrl} readOnly className="text-white" />
              <Button onClick={handleCopyLink} variant="outline" className="">
                {copied ? (
                  <ClipboardCheckIcon className="h-4 w-4 text-green-300" />
                ) : (
                  <Clipboard className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
