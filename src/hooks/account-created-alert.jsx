"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountCreatedAlert({ isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <Alert className="mb-4 bg-[#f0faf7] border border-[#28A745] relative max-w-xs w-full mx-auto rounded-md p-4 font-inter shadow-sm">
      <CheckCircle2Icon className="h-5 w-5 text-[#28A745]" />
      <AlertTitle className="text-[#2d2d5f] font-semibold">Sikse</AlertTitle>
      <AlertDescription className="text-[#6b7280]">
        Kont ou an kreye avèk siksè.
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-[#28A745] hover:text-[#2d2d5f] hover:bg-[#f8fafc]"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}
