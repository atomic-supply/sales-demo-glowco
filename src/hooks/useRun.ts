import { useContext } from "react";
import { RunContext } from "../contexts/RunContext";

export const useRun = () => {
  const context = useContext(RunContext);
  if (context === undefined) {
    throw new Error("useRun must be used within a RunProvider");
  }
  return context;
};
