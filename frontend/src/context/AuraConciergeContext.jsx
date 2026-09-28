"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { generateContextualGreeting, processAuraQuery } from "@/lib/auraEngine";

const AuraConciergeContext = createContext(undefined);

const STORAGE_KEY = "aura_concierge_session_v1";

export const AuraConciergeProvider = ({ children }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [roomConfig, setRoomConfig] = useState(null);
  const [hasContextAlert, setHasContextAlert] = useState(false);
  const [messages, setMessages] = useState([]);

  // Active context snapshot
  const activeContext = {
    pathname,
    currentProduct,
    roomConfig,
  };

  // Initialize or restore messages from session storage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not load AURA session from storage", e);
    }

    // Default first greeting
    const greeting = generateContextualGreeting(activeContext);
    setMessages([
      {
        id: "msg_init",
        role: "assistant",
        content: greeting.message,
        quickActions: greeting.quickActions,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
      },
    ]);
  }, []);

  // Save messages to session storage on change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
        console.warn("Could not save AURA session", e);
      }
    }
  }, [messages]);

  // Context alert when navigating to high-context pages
  useEffect(() => {
    if (pathname?.startsWith("/product/") || pathname === "/design-your-room") {
      setHasContextAlert(true);
    }
  }, [pathname]);

  const openConcierge = useCallback((initialPrompt) => {
    setIsOpen(true);
    setHasContextAlert(false);
    if (initialPrompt) {
      sendMessage(initialPrompt);
    }
  }, []);

  const closeConcierge = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleConcierge = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) setHasContextAlert(false);
      return next;
    });
  }, []);

  const resetConversation = useCallback(() => {
    const greeting = generateContextualGreeting({ pathname, currentProduct, roomConfig });
    const freshMessages = [
      {
        id: `msg_${Date.now()}`,
        role: "assistant",
        content: greeting.message,
        quickActions: greeting.quickActions,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
      },
    ];
    setMessages(freshMessages);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(freshMessages));
    } catch (e) {}
  }, [pathname, currentProduct, roomConfig]);

  const sendMessage = useCallback(
    async (text) => {
      if (!text || !text.trim()) return;

      const userMsg = {
        id: `user_${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      try {
        const response = await processAuraQuery(text, activeContext, messages);

        const assistantMsg = {
          id: `asst_${Date.now()}`,
          role: "assistant",
          content: response.content,
          type: response.type || "text",
          product: response.product,
          comparison: response.comparison,
          bundle: response.bundle,
          quickActions: response.followUpChips || [],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        console.error("Aura Concierge query failed:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            role: "assistant",
            content: "I apologize, my acoustic processing experienced a momentary disruption. Please re-state your query.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "text",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [activeContext, messages]
  );

  const updateProductContext = useCallback((product) => {
    setCurrentProduct(product);
  }, []);

  const updateRoomContext = useCallback((config) => {
    setRoomConfig(config);
  }, []);

  return (
    <AuraConciergeContext.Provider
      value={{
        isOpen,
        openConcierge,
        closeConcierge,
        toggleConcierge,
        messages,
        isTyping,
        sendMessage,
        resetConversation,
        updateProductContext,
        updateRoomContext,
        activeContext,
        hasContextAlert,
      }}
    >
      {children}
    </AuraConciergeContext.Provider>
  );
};

export const useAuraConcierge = () => {
  const context = useContext(AuraConciergeContext);
  if (!context) {
    throw new Error("useAuraConcierge must be used within an AuraConciergeProvider");
  }
  return context;
};
