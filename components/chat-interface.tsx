"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendIcon, MicIcon } from "lucide-react"
import { FeaturePanel } from "./feature-panel"
import { MessageArea } from "./message-area"
import { LegalGuidanceModal } from "./modals/legal-guidance-modal"
import { ComplaintDraftModal } from "./modals/complaint-draft-modal"
import { LawyerConnectModal } from "./modals/lawyer-connect-modal"
import { SosHelpModal } from "./modals/sos-help-modal"
import { FakeCallModal } from "./modals/fake-call-modal"
import { ChatHistory } from "./chat-history"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello, I'm SafeGuard, your AI legal assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!input.trim()) return

    // DSA: Use stack to store history, hardcode responses
    // Push user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    // Hardcoded assistant responses based on keywords or fallback
    let assistantReply = "I'm here to help you. Please provide more details.";
    if (/help|emergency|sos/i.test(input)) {
      assistantReply = "If this is an emergency, please contact local authorities or use the SOS feature.";
    } else if (/lawyer|legal/i.test(input)) {
      assistantReply = "I can connect you with a legal advisor. Would you like to proceed?";
    } else if (/rights|women/i.test(input)) {
      assistantReply = "Women's rights are protected under various laws. Would you like to know more about a specific right?";
    } else if (/complaint|file/i.test(input)) {
      assistantReply = "To file a complaint, please provide the details of your situation.";
    }
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: assistantReply,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setIsLoading(false);
  }

  const handleOpenModal = (modalName: string) => {
    setActiveModal(modalName)
  }

  const handleCloseModal = () => {
    setActiveModal(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-[calc(100vh-12rem)]">
      {/* Sidebar: Chat History (visible on md+) */}
      <div className="hidden md:block md:col-span-1">
        <ChatHistory messages={messages} onClearHistory={() => setMessages([
  {
    id: "welcome",
    role: "assistant",
    content: "Hello, I'm SafeGuard, your AI legal assistant. How can I help you today?",
    timestamp: new Date(),
  },
])} />
      </div>
      {/* Feature Panel (mobile and up) */}
      <FeaturePanel onFeatureSelect={handleOpenModal} />

      {/* Main Chat Area */}
      <div className="md:col-span-3 flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-800">
        <ScrollArea className="flex-1 p-4">
          <MessageArea messages={messages} isLoading={isLoading} />
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send message">
              <SendIcon className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" aria-label="Voice input">
              <MicIcon className="h-4 w-4" />
              <span className="sr-only">Voice input</span>
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Your conversations are private and encrypted. For emergencies, please use the SOS Help feature.
          </p>
        </div>
      </div>

      {/* Modals */}
      <LegalGuidanceModal
        open={activeModal === "legal-guidance"}
        onOpenChange={handleCloseModal}
        onSubmit={(data) => {
          const content = `I need legal guidance regarding ${data.issueType}. Details: ${data.details}`
          setInput(content)
          handleCloseModal()
          // Auto-submit after modal closes
          setTimeout(() => {
            handleSendMessage()
          }, 100)
        }}
      />

      <ComplaintDraftModal
        open={activeModal === "draft-complaint"}
        onOpenChange={handleCloseModal}
        onSubmit={(data) => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "user",
              content: `I need help drafting a complaint about ${data.incidentType} that occurred on ${data.date}.`,
              timestamp: new Date(),
            },
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: `I've prepared a draft complaint based on the information you provided about the ${data.incidentType} incident on ${data.date}. Here's the draft:\n\n[FORMAL COMPLAINT]\nDate: ${new Date().toLocaleDateString()}\nRe: ${data.incidentType} Incident on ${data.date}\n\nTo Whom It May Concern,\n\nI am writing to formally report an incident of ${data.incidentType} that occurred on ${data.date}. ${data.details}\n\nI request that this matter be investigated promptly and appropriate action be taken.\n\nSincerely,\n[Your Name]\n\nYou can copy this draft and modify it as needed. Would you like me to help you with any specific sections of the complaint?`,
              timestamp: new Date(),
            },
          ])
          handleCloseModal()
        }}
      />

      <LawyerConnectModal
        open={activeModal === "lawyer-connect"}
        onOpenChange={handleCloseModal}
        onSubmit={(data) => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "user",
              content: `I need to connect with a lawyer who specializes in ${data.specialization} in ${data.location}.`,
              timestamp: new Date(),
            },
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: `I've found several lawyers in ${data.location} who specialize in ${data.specialization}:\n\n1. Jane Smith - Women's Rights Attorney\n   Phone: (555) 123-4567\n   Email: jane.smith@legalfirm.com\n   Specializes in: ${data.specialization}, Domestic Violence\n\n2. Robert Johnson - Civil Rights Lawyer\n   Phone: (555) 987-6543\n   Email: robert.j@lawoffices.com\n   Specializes in: ${data.specialization}, Workplace Discrimination\n\n3. Maria Garcia - Family Law Attorney\n   Phone: (555) 456-7890\n   Email: m.garcia@familylaw.com\n   Specializes in: ${data.specialization}, Restraining Orders\n\nWould you like me to help you prepare for your consultation with any of these lawyers?`,
              timestamp: new Date(),
            },
          ])
          handleCloseModal()
        }}
      />

      <SosHelpModal
        open={activeModal === "sos-help"}
        onOpenChange={handleCloseModal}
        onSubmit={(data) => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "user",
              content: "I need to set up my SOS emergency contacts.",
              timestamp: new Date(),
            },
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: `I've set up your emergency contacts. In case of an emergency, click the SOS button and a message with your location will be sent to:\n\n1. ${data.contact1Name}: ${data.contact1Phone}\n2. ${data.contact2Name}: ${data.contact2Phone}\n\nYour emergency message: "${data.message}"\n\nYou can update these contacts at any time from your profile settings.`,
              timestamp: new Date(),
            },
          ])
          handleCloseModal()
        }}
      />

      <FakeCallModal open={activeModal === "fake-call"} onOpenChange={handleCloseModal} />
    </div>
  )
}
