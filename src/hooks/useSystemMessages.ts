import { useContext } from "react";
import { SystemMessagesContext } from "../contexts/SystemMessagesContext";

export const useSystemMessages = () => {
  const context = useContext(SystemMessagesContext);
  if (context === undefined) {
    throw new Error("useSystemMessages must be used within a SystemMessagesProvider");
  }
  return context;
};
