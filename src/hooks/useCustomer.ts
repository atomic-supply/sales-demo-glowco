import { useContext } from "react";
import { CustomerContext } from "../contexts/CustomerContext";
import { CUSTOMER_STORAGE_KEY, DEFAULT_CUSTOMER_ID } from "../contexts/CustomerContext/constants";

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
};

// Helper function to get customer ID directly from localStorage (for use outside React components)
export const getSelectedCustomerId = (): string => {
  if (typeof window === "undefined") {
    return DEFAULT_CUSTOMER_ID;
  }
  const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
  return stored || DEFAULT_CUSTOMER_ID;
};
