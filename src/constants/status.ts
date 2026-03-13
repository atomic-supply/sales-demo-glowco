export type StatusValue = "Needs Review" | "Sent" | "Skipped" | null;

export interface StatusOption {
  value: StatusValue;
  label: string;
  color: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
  { value: "Needs Review", label: "Needs Review", color: "#eab308" },
  { value: "Sent", label: "Sent", color: "#10b981" },
  { value: "Skipped", label: "Skipped", color: "#9ca3af" },
];
