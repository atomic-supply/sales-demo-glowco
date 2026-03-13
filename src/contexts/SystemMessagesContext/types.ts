export type SystemMessageType = "error" | "warning" | "info" | "success";

export interface SystemMessage {
  id: string;
  type: SystemMessageType;
  title: string;
  description?: string;
  autoDismiss?: boolean;
  dismissAfterMs?: number;
  /** Optional action button label (e.g. "Accept incoming values") */
  actionLabel?: string;
  /** Called when the action button is clicked; receives message id. Caller may call removeMessage(id) after. */
  onAction?: (messageId: string) => void;
}

interface SystemMessagesContextType {
  /**
   * Add a message. If a custom `id` is provided and a message with that ID
   * already exists, the call is a no-op (deduplication).
   * Returns the message ID.
   */
  addMessage: (message: Omit<SystemMessage, "id"> & { id?: string }) => string;
  removeMessage: (id: string) => void;
  clearAll: () => void;
  messages: readonly SystemMessage[];
}

export type { SystemMessagesContextType };
