import { createContext, useContext, useState, useCallback, useMemo, type FC, type ReactNode } from "react"
import { useLocation } from "react-router"
import { getDemoResponse } from "../../data/nucleus-demo-responses"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface NucleusState {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
  currentPage: string
  currentPageLabel: string
  messages: ChatMessage[]
  sendMessage: (text: string) => void
  clearMessages: () => void
}

// ─── Route → label mapping ──────────────────────────────────────────────────

const PAGE_LABELS: Record<string, string> = {
  "/data-hub": "Data Hub",
  "/plan-status": "Plan Status",
  "/consumption/plan": "Consumption Plan",
  "/consumption/pivot": "Consumption Pivot",
  "/consumption/validation": "Consumption Validation",
  "/plan/shipments": "Shipments",
  "/plan/production": "Production",
  "/plan/kitting": "Kitting",
  "/plan/mrp": "MRP",
  "/plan/allocation": "Allocation",
}

function getPageLabel(pathname: string): string {
  return PAGE_LABELS[pathname] ?? "Planning"
}

// ─── Context ────────────────────────────────────────────────────────────────

const NucleusContext = createContext<NucleusState | null>(null)

let messageIdCounter = 0
function nextId(): string {
  return `msg-${++messageIdCounter}-${Date.now()}`
}

// ─── Provider ───────────────────────────────────────────────────────────────

export const NucleusProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const currentPage = location.pathname
  const currentPageLabel = getPageLabel(currentPage)

  const toggle = useCallback(() => setIsOpen(prev => !prev), [])
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const clearMessages = useCallback(() => setMessages([]), [])

  const sendMessage = useCallback((text: string) => {
    const userMsg: ChatMessage = {
      id: nextId(),
      role: "user",
      content: text,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])

    // Simulate AI response after a brief delay
    setTimeout(() => {
      const responseText = getDemoResponse(currentPage, text)
      const assistantMsg: ChatMessage = {
        id: nextId(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMsg])
    }, 600 + Math.random() * 800)
  }, [currentPage])

  const value = useMemo<NucleusState>(() => ({
    isOpen,
    toggle,
    open,
    close,
    currentPage,
    currentPageLabel,
    messages,
    sendMessage,
    clearMessages,
  }), [isOpen, toggle, open, close, currentPage, currentPageLabel, messages, sendMessage, clearMessages])

  return (
    <NucleusContext.Provider value={value}>
      {children}
    </NucleusContext.Provider>
  )
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useNucleus(): NucleusState {
  const ctx = useContext(NucleusContext)
  if (!ctx) throw new Error("useNucleus must be used inside NucleusProvider")
  return ctx
}
