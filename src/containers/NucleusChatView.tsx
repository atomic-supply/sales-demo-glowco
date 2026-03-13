/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useState, useEffect, type FC } from "react"
import { Send } from "lucide-react"
import { theme, alpha } from "../styles/theme/theme"

const NUCLEUS_COLOR = theme.colors.nucleus

const features = [
  "Run-aware answers",
  "Tool-backed diagnosis",
  "SQL-backed tables",
  "Traceable reasoning",
  "Docs + metrics context",
]

const quickActions = [
  "Top At-Risk SKUs",
  "Diagnose One SKU",
  "Latest Run Delta",
  "Supply Walk View",
  "Data Setup",
]

const typingPhrases = [
  "what changed since the last run?",
  "which SKUs are at risk this week?",
  "show me the supply walk for beef sticks",
  "what's driving the forecast variance?",
  "summarize the latest plan changes",
]

const styles = {
  page: css`
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${theme.colors.background};
    padding: 1rem;
  `,
  inner: css`
    display: flex;
    width: 100%;
    max-width: 42rem;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  `,
  logoSection: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  `,
  logoIcon: css`
    color: ${NUCLEUS_COLOR};
  `,
  title: css`
    font-size: 1.875rem;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: ${theme.colors.foreground};
    margin: 0;
  `,
  typingLine: css`
    height: 1.5rem;
    text-align: center;
    font-size: 1rem;
    color: ${theme.colors.mutedForeground};
  `,
  cursor: css`
    display: inline-block;
    width: 2px;
    height: 1rem;
    margin-left: 1px;
    animation: pulse 1s ease-in-out infinite;
    background-color: ${theme.colors.mutedForeground};
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `,
  inputWrapper: css`
    width: 100%;
    position: relative;
  `,
  input: css`
    height: 3rem;
    width: 100%;
    border-radius: 9999px;
    border: 1px solid ${theme.colors.border};
    background-color: ${theme.colors.background};
    padding: 0 3rem 0 1.25rem;
    font-size: 0.875rem;
    color: ${theme.colors.foreground};
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
    &::placeholder {
      color: ${alpha(theme.colors.mutedForeground, 0.6)};
    }
    &:focus {
      border-color: ${NUCLEUS_COLOR};
      box-shadow: 0 0 0 1px ${NUCLEUS_COLOR};
    }
  `,
  sendButton: css`
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: none;
    background: none;
    cursor: pointer;
    color: ${alpha(theme.colors.mutedForeground, 0.5)};
    transition: background-color 0.15s, color 0.15s;
    &:hover {
      background-color: ${theme.colors.muted};
      color: ${theme.colors.mutedForeground};
    }
  `,
  featuresCard: css`
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid ${theme.colors.border};
    background: ${theme.colors.background};
    padding: 1.25rem;
  `,
  featuresTitle: css`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${theme.colors.foreground};
    margin: 0 0 0.75rem;
  `,
  featureBadges: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  `,
  featureBadge: css`
    border-radius: 0.375rem;
    border: 1px solid ${theme.colors.border};
    background: ${theme.colors.background};
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
    color: ${theme.colors.mutedForeground};
  `,
  quickActionsLabel: css`
    font-size: 0.75rem;
    color: ${alpha(theme.colors.mutedForeground, 0.7)};
    margin: 0 0 0.625rem;
  `,
  quickActionButtons: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  `,
  quickActionButton: css`
    border-radius: 0.375rem;
    border: 1px solid ${NUCLEUS_COLOR}4d;
    background: ${NUCLEUS_COLOR}0d;
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: ${NUCLEUS_COLOR};
    cursor: pointer;
    transition: border-color 0.15s, background-color 0.15s;
    &:hover {
      border-color: ${NUCLEUS_COLOR}80;
      background: ${NUCLEUS_COLOR}1a;
    }
  `,
}

export const NucleusChatView: FC = () => {
  const [inputValue, setInputValue] = useState("")
  const [typingText, setTypingText] = useState("")
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentPhrase = typingPhrases[phraseIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentPhrase.length) {
          setTypingText(currentPhrase.slice(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (charIndex > 0) {
          setTypingText(currentPhrase.slice(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        } else {
          setIsDeleting(false)
          setPhraseIndex((phraseIndex + 1) % typingPhrases.length)
        }
      }
    }, isDeleting ? 30 : 60)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, phraseIndex])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder - no actual submission
  }

  return (
    <div css={styles.page}>
      <div css={styles.inner}>
        {/* Logo */}
        <div css={styles.logoSection}>
          <svg
            css={styles.logoIcon}
            width={64}
            height={64}
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
          <h1 css={styles.title}>Nucleus</h1>
        </div>

        {/* Typing animation */}
        <p css={styles.typingLine}>
          {typingText}
          <span css={styles.cursor} />
        </p>

        {/* Input field */}
        <form onSubmit={handleSubmit} css={styles.inputWrapper}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ask Nucleus ..."
            css={styles.input}
          />
          <button type="submit" css={styles.sendButton}>
            <Send size={16} />
          </button>
        </form>

        {/* Features card */}
        <div css={styles.featuresCard}>
          <h2 css={styles.featuresTitle}>What Nucleus can do for planners</h2>

          <div css={styles.featureBadges}>
            {features.map((feature) => (
              <span key={feature} css={styles.featureBadge}>{feature}</span>
            ))}
          </div>

          <p css={styles.quickActionsLabel}>Pick a quick action:</p>
          <div css={styles.quickActionButtons}>
            {quickActions.map((action) => (
              <button key={action} type="button" css={styles.quickActionButton}>
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
