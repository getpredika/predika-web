import { LoaderCircle, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function SearchBar({ value, onChange, isLoading = false, className }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "relative w-full transition-all duration-300 ease-out",
        className
      )}
    >
      <div className={cn(
        "absolute inset-y-0 left-4 flex items-center pointer-events-none transition-all duration-300",
        isFocused ? "text-primary scale-110" : "text-muted-foreground scale-100"
      )}>
        {isLoading ? (
          <LoaderCircle
            className="animate-spin h-5 w-5"
            size={16}
            strokeWidth={2}
            role="status"
            aria-label="Loading..."
          />
        ) : (
          <Search size={16} strokeWidth={2} aria-hidden="true" className="h-5 w-5" />
        )}
        {/* <Search className="h-5 w-5" /> */}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Chèche yon mo..."
        className={cn(
          "w-full h-14 pl-12 pr-12 rounded-xl border-2 transition-all duration-300 font-medium text-lg",
          "bg-gradient-to-br from-white to-stone-50",
          "placeholder:text-stone-400/70 text-foreground",
          "focus:outline-none",
          isFocused
            ? "border-primary/50 shadow-lg shadow-primary/10 ring-2 ring-primary/10"
            : "border-stone-200 shadow-md shadow-stone-200/30 hover:shadow-lg hover:shadow-stone-200/40 hover:border-stone-300"
        )}
        data-testid="input-search"
      />

      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-4 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Clear search"
          data-testid="button-clear-search"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
