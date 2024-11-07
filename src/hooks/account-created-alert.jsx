"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { CheckCircle2Icon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function AccountCreatedAlert({ isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <Alert className="mb-4 bg-green-50 border-green-200">
      <CheckCircle2Icon className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">Success</AlertTitle>
      <AlertDescription className="text-green-700">
        kont ou an kreye avek sikse
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-green-600 hover:text-green-800 hover:bg-green-100"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}
