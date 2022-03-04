import { useEffect } from "react";

export function useCustomEventEffect(
  event: string,
  handler: EventListener
): void {
  useEffect(() => {
    document.addEventListener(event, handler);
    return function cleanupListener() {
      document.removeEventListener(event, handler);
    };
  });
}
