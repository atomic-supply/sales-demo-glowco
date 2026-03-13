/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useState, useRef, useMemo, type ReactNode } from "react";
import type { SystemMessage, SystemMessagesContextType } from "./types";

export const SystemMessagesContext = createContext<SystemMessagesContextType | undefined>(
  undefined
);

export const SystemMessagesProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<readonly SystemMessage[]>([]);
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeMessage = useCallback((id: string) => {
    // Clear timeout if exists
    const timeout = timeoutRefs.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutRefs.current.delete(id);
    }

    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  const addMessage = useCallback(
    (message: Omit<SystemMessage, "id"> & { id?: string }): string => {
      const id = message.id ?? `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      setMessages((prev) => {
        // Deduplicate: if a custom id was provided and already exists, skip
        if (message.id && prev.some((m) => m.id === message.id)) {
          return prev;
        }
        return [...prev, { ...message, id, autoDismiss: message.autoDismiss ?? false }];
      });

      // Set up auto-dismiss if enabled
      if (message.autoDismiss) {
        const dismissAfter = message.dismissAfterMs ?? 5000;
        const timeout = setTimeout(() => {
          removeMessage(id);
        }, dismissAfter);
        timeoutRefs.current.set(id, timeout);
      }

      return id;
    },
    [removeMessage],
  );

  const clearAll = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
    timeoutRefs.current.clear();
    setMessages([]);
  }, []);

  // Memoize context value to prevent unnecessary rerenders
  const contextValue = useMemo(
    () => ({
      addMessage,
      removeMessage,
      clearAll,
      messages,
    }),
    [addMessage, removeMessage, clearAll, messages]
  );

  return (
    <SystemMessagesContext.Provider value={contextValue}>{children}</SystemMessagesContext.Provider>
  );
};

// Re-export types for convenience
export type { SystemMessage, SystemMessageType, SystemMessagesContextType } from "./types";
