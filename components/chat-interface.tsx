"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

type Lawyer = {
  name: string;
  specialization: string;
  location: string;
  phone: string;
  email: string;
};
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
  // ...
  // Undo: Remove last prompt/response pair
  const handleUndo = () => {
    setMessages((prev) => {
      if (prev.length <= 1) return prev; // Keep welcome message
      // Remove last user+assistant pair, or just last if odd
      const n = prev.length;
      if (prev[n-1].role === "assistant" && prev[n-2]?.role === "user") {
        return prev.slice(0, n-2);
      } else {
        return prev.slice(0, n-1);
      }
    });
  };
  // Delete: Remove by id
  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter(m => m.id !== id));
  };
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
        ])} onDelete={handleDelete} />
      </div>
      {/* Feature Panel (mobile and up) */}
      <FeaturePanel onFeatureSelect={handleOpenModal} />

      {/* Main Chat Area */}
      <div className="md:col-span-3 flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-800">
        <ScrollArea className="flex-1 p-4">
          <MessageArea messages={messages} isLoading={isLoading} onDelete={handleDelete} />
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Button type="button" variant="secondary" onClick={handleUndo} disabled={messages.length <= 1} className="mr-2">
              Undo
            </Button>
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
        onSubmit={async (data) => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "user",
              content: `I need to connect with a lawyer who specializes in ${data.specialization} in ${data.location}.`,
              timestamp: new Date(),
            },
          ])
          setIsLoading(true)
          // Hardcoded fallback lawyer data
          const hardcodedLawyers = [
            { name: "Aditi Sharma", specialization: "harassment", location: "pune", phone: "(555) 111-2222", email: "aditi.sharma@lawhelp.com" },
            { name: "Rahul Mehra", specialization: "domestic_violence", location: "mumbai", phone: "(555) 333-4444", email: "rahul.mehra@legalfirm.com" },
            { name: "Priya Verma", specialization: "workplace_discrimination", location: "pune", phone: "(555) 555-6666", email: "priya.verma@lawyer.com" },
            { name: "Sanjay Singh", specialization: "sexual_assault", location: "delhi", phone: "(555) 777-8888", email: "sanjay.singh@justice.com" },
            { name: "Nisha Patel", specialization: "family_law", location: "pune", phone: "(555) 999-0000", email: "nisha.patel@familylaw.com" },
            { name: "Arjun Rao", specialization: "restraining_orders", location: "mumbai", phone: "(555) 222-3333", email: "arjun.rao@protection.com" },
            { name: "Rohit Deshmukh", specialization: "workplace_discrimination", location: "mumbai", phone: "(555) 123-4567", email: "rohit.deshmukh@lawhelp.com" },
          ];
          try {
            const response = await fetch(`/api/lawyers?specialization=${encodeURIComponent(data.specialization)}&location=${encodeURIComponent(data.location)}`)
            let lawyers = [];
            if (response.ok) {
              lawyers = await response.json();
            }
            // If backend returns no results, use hardcoded fallback
            if (!lawyers || lawyers.length === 0) {
              lawyers = hardcodedLawyers.filter((l: Lawyer) =>
                l.specialization === data.specialization && l.location.toLowerCase() === data.location.toLowerCase()
              );
              // If still no results, try matching either specialization or location
              if (lawyers.length === 0) {
                lawyers = hardcodedLawyers.filter((l: Lawyer) =>
                  l.specialization === data.specialization || l.location.toLowerCase() === data.location.toLowerCase()
                );
              }
            }
            let content = "";
            if (lawyers.length > 0) {
              content = `I've found the following lawyers in ${data.location} who specialize in ${data.specialization}:\n\n` +
                lawyers.map((l: Lawyer, idx: number) =>
                  `${idx + 1}. ${l.name}\n   Phone: ${l.phone}\n   Email: ${l.email}\n   Specializes in: ${l.specialization}\n`
                ).join("\n") +
                "\nWould you like me to help you prepare for your consultation with any of these lawyers?";
            } else {
              content = `Sorry, I couldn't find any lawyers in ${data.location} who specialize in ${data.specialization}.`;
            }
            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content,
                timestamp: new Date(),
              },
            ]);
          } catch (error) {
            // On fetch error, use hardcoded fallback
            const lawyers = hardcodedLawyers.filter((l: { name: string; specialization: string; location: string; phone: string; email: string }) =>
              l.specialization === data.specialization && l.location.toLowerCase() === data.location.toLowerCase()
            );
            let content = "";
            if (lawyers.length > 0) {
              content = `I've found the following lawyers in ${data.location} who specialize in ${data.specialization}:\n\n` +
                lawyers.map((l: Lawyer, idx: number) =>
                  `${idx + 1}. ${l.name}\n   Phone: ${l.phone}\n   Email: ${l.email}\n   Specializes in: ${l.specialization}\n`
                ).join("\n") +
                "\nWould you like me to help you prepare for your consultation with any of these lawyers?";
            } else {
              content = `Sorry, I couldn't find any lawyers in ${data.location} who specialize in ${data.specialization}.`;
            }
            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + 2).toString(),
                role: "assistant",
                content,
                timestamp: new Date(),
              },
            ]);
          } finally {
            setIsLoading(false);
            handleCloseModal();
          }
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
