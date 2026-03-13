/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { useSystemMessages } from "../hooks/useSystemMessages";
import type { SystemMessageType } from "../contexts/SystemMessagesContext";
import { memo } from "react";

const messageTypeIcons: Record<SystemMessageType, typeof AlertCircle> = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

const messageTypeColors: Record<
  SystemMessageType,
  { bg: string; border: string; text: string; icon: string }
> = {
  error: {
    bg: "#fef2f2",
    border: "#fecaca",
    text: "#991b1b",
    icon: "#dc2626",
  },
  warning: {
    bg: "#fffbeb",
    border: "#fde68a",
    text: "#92400e",
    icon: "#d97706",
  },
  info: {
    bg: "#eff6ff",
    border: "#bfdbfe",
    text: "#1e40af",
    icon: "#2563eb",
  },
  success: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    text: "#166534",
    icon: "#16a34a",
  },
};

const SystemMessages = memo(() => {
  const { messages, removeMessage } = useSystemMessages();

  if (messages.length === 0) {
    return null;
  }

  return (
    <div
      css={css`
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 28rem;
        pointer-events: none;
      `}
    >
      {messages.map((message) => {
        const Icon = messageTypeIcons[message.type];
        const colors = messageTypeColors[message.type];

        return (
          <div
            key={message.id}
            css={css`
              background-color: ${colors.bg};
              border: 1px solid ${colors.border};
              border-radius: 0.5rem;
              padding: 0.75rem 1rem;
              box-shadow:
                0 10px 15px -3px rgb(0 0 0 / 0.1),
                0 4px 6px -4px rgb(0 0 0 / 0.1);
              pointer-events: auto;
              display: flex;
              gap: 0.75rem;
              align-items: flex-start;
              animation: slideIn 0.2s ease-out;

              @keyframes slideIn {
                from {
                  transform: translateX(100%);
                  opacity: 0;
                }
                to {
                  transform: translateX(0);
                  opacity: 1;
                }
              }
            `}
          >
            <Icon
              css={css`
                width: 1.25rem;
                height: 1.25rem;
                flex-shrink: 0;
                margin-top: 0.125rem;
                color: ${colors.icon};
              `}
            />
            <div
              css={css`
                flex: 1;
                min-width: 0;
              `}
            >
              <div
                css={css`
                  font-weight: 600;
                  font-size: 0.875rem;
                  color: ${colors.text};
                  margin-bottom: ${message.description ? "0.25rem" : "0"};
                `}
              >
                {message.title}
              </div>
              {message.description && (
                <div
                  css={css`
                    font-size: 0.8125rem;
                    color: ${colors.text};
                    opacity: 0.9;
                    word-wrap: break-word;
                  `}
                >
                  {message.description}
                </div>
              )}
              {message.actionLabel && message.onAction && (
                <button
                  type="button"
                  onClick={() => {
                    message.onAction?.(message.id);
                    removeMessage(message.id);
                  }}
                  css={css`
                    margin-top: 0.5rem;
                    font-size: 0.8125rem;
                    font-weight: 500;
                    color: ${colors.icon};
                    background: none;
                    border: 1px solid ${colors.border};
                    border-radius: 0.25rem;
                    padding: 0.25rem 0.5rem;
                    cursor: pointer;
                    &:hover {
                      opacity: 0.9;
                      background-color: rgba(0, 0, 0, 0.04);
                    }
                  `}
                >
                  {message.actionLabel}
                </button>
              )}
            </div>
            <button
              onClick={() => removeMessage(message.id)}
              css={css`
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.25rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${colors.text};
                opacity: 0.7;
                flex-shrink: 0;
                border-radius: 0.25rem;

                &:hover {
                  opacity: 1;
                  background-color: rgba(0, 0, 0, 0.05);
                }
              `}
              aria-label="Dismiss message"
            >
              <X
                css={css`
                  width: 1rem;
                  height: 1rem;
                `}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
});

SystemMessages.displayName = "SystemMessages";

export default SystemMessages;
