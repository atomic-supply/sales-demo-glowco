/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from "react";
import { CUSTOMER_STORAGE_KEY, DEFAULT_CUSTOMER_ID } from "./constants";
import type { CustomerContextType } from "./types";

export const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCustomerId, setSelectedCustomerIdState] = useState<string>(() => {
    // Initialize from localStorage or use default
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      return stored || DEFAULT_CUSTOMER_ID;
    }
    return DEFAULT_CUSTOMER_ID;
  });

  const setSelectedCustomerId = (customerId: string) => {
    setSelectedCustomerIdState(customerId);
    if (typeof window !== "undefined") {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, customerId);
    }
  };

  // Sync with localStorage changes from other tabs/windows
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CUSTOMER_STORAGE_KEY && e.newValue) {
        setSelectedCustomerIdState(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <CustomerContext.Provider value={{ selectedCustomerId, setSelectedCustomerId }}>
      {children}
    </CustomerContext.Provider>
  );
};
