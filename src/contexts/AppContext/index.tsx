/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, type ReactNode } from "react";
import type { AppContextType } from "./types";

// Provide a default value to make the context optional
export const AppContext = createContext<AppContextType>({
  orderDate: null,
  setOrderDate: () => {
    // No-op default implementation
  },
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [orderDate, setOrderDate] = useState<string | null>(null);

  return <AppContext.Provider value={{ orderDate, setOrderDate }}>{children}</AppContext.Provider>;
};
