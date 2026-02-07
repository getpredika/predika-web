import { useEffect, useRef, useState } from "react";

/**
 * Hook that manages an Object URL lifecycle for a Blob.
 * Creates a URL when blob is provided, revokes the previous URL on change,
 * and revokes on unmount. Prevents memory leaks from orphaned Object URLs.
 */
export function useObjectUrl(blob: Blob | null | undefined): string | null {
    const [url, setUrl] = useState<string | null>(null);
    const urlRef = useRef<string | null>(null);

    useEffect(() => {
        // Revoke previous URL
        if (urlRef.current) {
            URL.revokeObjectURL(urlRef.current);
            urlRef.current = null;
        }

        if (blob) {
            const newUrl = URL.createObjectURL(blob);
            urlRef.current = newUrl;
            setUrl(newUrl);
        } else {
            setUrl(null);
        }

        return () => {
            if (urlRef.current) {
                URL.revokeObjectURL(urlRef.current);
                urlRef.current = null;
            }
        };
    }, [blob]);

    return url;
}
