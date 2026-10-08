import { INITIAL_CONVERSATIONS } from "./mock-data";
import { ChatConversation, ChatMessage } from "./types";

const STORAGE_KEY = "inhubflow_inbox_conversations";

export function getInboxConversations(): ChatConversation[] {
  if (typeof window === "undefined") return INITIAL_CONVERSATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
      return INITIAL_CONVERSATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CONVERSATIONS;
  }
}

export function saveInboxConversations(conversations: ChatConversation[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // ignore
  }
}

export function sendMessageToConversation(
  conversationId: string,
  text: string,
  attachment?: { name: string; type: "pdf" | "audio" | "image"; size?: string }
): ChatConversation[] {
  const list = getInboxConversations();
  const updated = list.map((c) => {
    if (c.id === conversationId) {
      const newMsg: ChatMessage = {
        id: "msg-" + Date.now(),
        senderId: "user",
        senderName: "Roberto",
        isSender: true,
        text,
        timestamp: "Ahora",
        attachment,
      };

      // Si el usuario envia mensaje, actualizar ultimo mensaje
      return {
        ...c,
        lastMessage: text || (attachment ? `Archivo adjunto: ${attachment.name}` : "Mensaje enviado"),
        lastMessageTime: "Ahora",
        messages: [...c.messages, newMsg],
      };
    }
    return c;
  });

  saveInboxConversations(updated);
  return updated;
}

export function updateConversationStage(
  conversationId: string,
  newStage: string,
  newStageId: string
): ChatConversation[] {
  const list = getInboxConversations();
  const updated = list.map((c) => {
    if (c.id === conversationId) {
      return {
        ...c,
        crmStage: newStage,
        crmStageId: newStageId,
      };
    }
    return c;
  });

  saveInboxConversations(updated);
  return updated;
}

export function markConversationAsRead(conversationId: string): ChatConversation[] {
  const list = getInboxConversations();
  const updated = list.map((c) => {
    if (c.id === conversationId) {
      return {
        ...c,
        unread: false,
      };
    }
    return c;
  });

  saveInboxConversations(updated);
  return updated;
}
