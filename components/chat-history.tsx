"use client"

import React, { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

export interface ChatHistoryProps {
  messages: { id: string; role: string; content: string; timestamp: Date }[];
  onClearHistory: () => void;
  onDelete: (id: string) => void;
}

export function ChatHistory({ messages, onClearHistory, onDelete }: ChatHistoryProps) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold">Chat History (Stack)</h2>
        <button
          className="ml-2 px-3 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600"
          onClick={onClearHistory}
          type="button"
        >
          Clear History
        </button>
      </div>
      <ScrollArea className="flex-1 p-4 max-h-[400px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-gray-500">No history found.</div>
        ) : (
          <ul className="space-y-2">
            {messages.map((msg, idx) => (
              <li key={msg.id} className={`rounded p-2 text-sm ${msg.role === "user" ? "bg-blue-100 dark:bg-blue-900" : "bg-purple-100 dark:bg-gray-800"}`}>
                <span className="font-semibold">{msg.role === "user" ? "User" : "Assistant"}:</span> {msg.content}
                <button
                  className="ml-2 px-2 py-1 text-xs rounded bg-red-200 hover:bg-red-400 text-red-900"
                  onClick={() => onDelete(msg.id)}
                  type="button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
}
