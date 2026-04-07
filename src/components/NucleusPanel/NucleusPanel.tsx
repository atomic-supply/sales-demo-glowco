/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useState, useRef, useEffect, type FC } from "react"
import { X, Send, Atom } from "lucide-react"
import { theme, alpha } from "../../styles/theme/theme"
import { useNucleus, type ChatMessage } from "../../contexts/NucleusContext"
import { borders } from "../../styles"

const NUCLEUS_COLOR = theme.colors.nucleus
const { colors } = theme

const QUICK_ACTIONS = [
  "Top At-Risk SKUs",
  "Diagnose One SKU",
  "Latest Run Delta",
  "Supply Walk View",
  "Data Setup",
]

// ─── Styles ─────────────────────────────────────────────────────────────────

const s = {
  panel: css`
    width: 380px;
    min-width: 380px;
    height: 100%;
    display: flex;
    flex-direction: column;
    ${borders.left}
    background-color: ${colors.background};
    overflow: hidden;
  `,

  // ─── Header ───────────────────────────────────────────────────────
  header: css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 0.75rem;
    height: 3rem;
    box-sizing: border-box;
    flex-shrink: 0;
    ${borders.bottom}
  `,
  headerIcon: css`
    color: ${NUCLEUS_COLOR};
    flex-shrink: 0;
  `,
  headerTitle: css`
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${NUCLEUS_COLOR};
    flex-shrink: 0;
  `,
  contextChip: css`
    margin-left: auto;
    font-size: 0.6875rem;
    color: ${colors.mutedForeground};
    background: ${colors.muted};
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
  `,
  closeBtn: css`
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    border-radius: 0.25rem;
    cursor: pointer;
    color: ${colors.mutedForeground};
    transition: background-color 0.15s, color 0.15s;
    &:hover {
      background-color: ${colors.muted};
      color: ${colors.foreground};
    }
  `,

  // ─── Messages area ────────────────────────────────────────────────
  messagesArea: css`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-height: 0;
  `,

  // ─── Welcome state ────────────────────────────────────────────────
  welcome: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 1rem;
    padding: 1rem;
  `,
  welcomeIcon: css`
    color: ${NUCLEUS_COLOR};
    opacity: 0.6;
  `,
  welcomeTitle: css`
    font-size: 1rem;
    font-weight: 500;
    color: ${colors.foreground};
    margin: 0;
  `,
  welcomeSubtitle: css`
    font-size: 0.75rem;
    color: ${colors.mutedForeground};
    text-align: center;
    margin: 0;
    line-height: 1.5;
  `,
  quickActionsLabel: css`
    font-size: 0.6875rem;
    color: ${alpha(colors.mutedForeground, 0.7)};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 500;
    margin-top: 0.5rem;
  `,
  quickActions: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    justify-content: center;
  `,
  quickActionBtn: css`
    border-radius: 0.375rem;
    border: 1px solid ${NUCLEUS_COLOR}4d;
    background: ${NUCLEUS_COLOR}0d;
    padding: 0.3rem 0.625rem;
    font-size: 0.6875rem;
    font-weight: 500;
    color: ${NUCLEUS_COLOR};
    cursor: pointer;
    transition: border-color 0.15s, background-color 0.15s;
    &:hover {
      border-color: ${NUCLEUS_COLOR}80;
      background: ${NUCLEUS_COLOR}1a;
    }
  `,

  // ─── Chat messages ────────────────────────────────────────────────
  message: (isUser: boolean) => css`
    max-width: 92%;
    padding: 0.625rem 0.75rem;
    border-radius: ${isUser ? "0.75rem 0.75rem 0.125rem 0.75rem" : "0.75rem 0.75rem 0.75rem 0.125rem"};
    font-size: 0.8125rem;
    line-height: 1.55;
    word-break: break-word;
    align-self: ${isUser ? "flex-end" : "flex-start"};
    background-color: ${isUser ? NUCLEUS_COLOR : colors.muted};
    color: ${isUser ? "#fff" : colors.foreground};

    strong {
      font-weight: 600;
    }

    p {
      margin: 0.25rem 0;
    }

    ul, ol {
      margin: 0.25rem 0;
      padding-left: 1.25rem;
    }

    li {
      margin: 0.125rem 0;
    }

    code {
      font-size: 0.75rem;
      background: ${isUser ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.06)"};
      padding: 0.1rem 0.3rem;
      border-radius: 0.2rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.75rem;
      margin: 0.375rem 0;
    }
    th, td {
      padding: 0.2rem 0.4rem;
      text-align: left;
      border-bottom: 1px solid ${isUser ? "rgba(255,255,255,0.2)" : colors.border};
    }
    th {
      font-weight: 600;
    }
  `,

  typingIndicator: css`
    align-self: flex-start;
    display: flex;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    background-color: ${colors.muted};
    border-radius: 0.75rem 0.75rem 0.75rem 0.125rem;

    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: ${colors.mutedForeground};
      animation: bounce 1.2s infinite ease-in-out;
    }
    span:nth-of-type(2) { animation-delay: 0.2s; }
    span:nth-of-type(3) { animation-delay: 0.4s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }
  `,

  // ─── Input area ───────────────────────────────────────────────────
  inputArea: css`
    flex-shrink: 0;
    padding: 0.625rem 0.75rem;
    ${borders.top}
  `,
  inputWrapper: css`
    position: relative;
    width: 100%;
  `,
  input: css`
    height: 2.5rem;
    width: 100%;
    border-radius: 9999px;
    border: 1px solid ${colors.border};
    background-color: ${colors.background};
    padding: 0 2.5rem 0 1rem;
    font-size: 0.8125rem;
    color: ${colors.foreground};
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
    &::placeholder {
      color: ${alpha(colors.mutedForeground, 0.6)};
    }
    &:focus {
      border-color: ${NUCLEUS_COLOR};
      box-shadow: 0 0 0 1px ${NUCLEUS_COLOR};
    }
  `,
  sendBtn: css`
    position: absolute;
    right: 0.375rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.75rem;
    height: 1.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: none;
    background: none;
    cursor: pointer;
    color: ${alpha(colors.mutedForeground, 0.5)};
    transition: background-color 0.15s, color 0.15s;
    &:hover {
      background-color: ${colors.muted};
      color: ${NUCLEUS_COLOR};
    }
  `,
}

// ─── Markdown-lite renderer ─────────────────────────────────────────────────

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n• /g, "</p><ul><li>")
    .replace(/\n(\d+)\. /g, "</p><ol><li>")
    .replace(/<\/li>\n• /g, "</li><li>")
    .replace(/<li>([^<]*?)(?=<\/li>|$)/g, "<li>$1</li>")
    // Close unclosed lists
    .replace(/<\/li>(?![\s\S]*?<\/(ul|ol)>)/g, "</li></ul>")
}

// ─── Component ──────────────────────────────────────────────────────────────

export const NucleusPanel: FC = () => {
  const { close, currentPageLabel, messages, sendMessage } = useNucleus()
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevMessageCount = useRef(messages.length)

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    prevMessageCount.current = messages.length
  }, [messages.length])

  // Track typing state
  useEffect(() => {
    const lastMsg = messages[messages.length - 1]
    if (lastMsg?.role === "user") {
      setIsTyping(true)
    } else {
      setIsTyping(false)
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = inputValue.trim()
    if (!text) return
    setInputValue("")
    sendMessage(text)
  }

  const handleQuickAction = (action: string) => {
    sendMessage(action)
  }

  const hasMessages = messages.length > 0

  return (
    <div css={s.panel}>
      {/* Header */}
      <div css={s.header}>
        <Atom size={16} css={s.headerIcon} />
        <span css={s.headerTitle}>Nucleus</span>
        <span css={s.contextChip}>{currentPageLabel}</span>
        <button css={s.closeBtn} onClick={close} title="Close Nucleus">
          <X size={14} />
        </button>
      </div>

      {/* Messages / Welcome */}
      <div css={s.messagesArea}>
        {!hasMessages ? (
          <div css={s.welcome}>
            <svg
              css={s.welcomeIcon}
              width={40}
              height={40}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
              <ellipse cx="12" cy="12" rx="9" ry="4" />
              <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" />
              <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)" />
            </svg>
            <h3 css={s.welcomeTitle}>Ask Nucleus</h3>
            <p css={s.welcomeSubtitle}>
              AI-powered planning assistant with context
              on your current {currentPageLabel.toLowerCase()} view.
            </p>
            <span css={s.quickActionsLabel}>Quick actions</span>
            <div css={s.quickActions}>
              {QUICK_ACTIONS.map(action => (
                <button
                  key={action}
                  type="button"
                  css={s.quickActionBtn}
                  onClick={() => handleQuickAction(action)}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <div
                key={msg.id}
                css={s.message(msg.role === "user")}
                dangerouslySetInnerHTML={
                  msg.role === "assistant"
                    ? { __html: renderMarkdown(msg.content) }
                    : undefined
                }
              >
                {msg.role === "user" ? msg.content : undefined}
              </div>
            ))}
            {isTyping && (
              <div css={s.typingIndicator}>
                <span /><span /><span />
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div css={s.inputArea}>
        <form onSubmit={handleSubmit} css={s.inputWrapper}>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={`Ask about ${currentPageLabel.toLowerCase()}...`}
            css={s.input}
          />
          <button type="submit" css={s.sendBtn}>
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  )
}
