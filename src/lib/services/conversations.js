import { request } from "$lib/api/supabase";

export async function getConversations() {
    return await request("/conversations");
}

export async function deleteConversation(conversationId) {
    const data = await request(`conversations?id=eq.${conversationId}`, {
        method: "DELETE"
    });

    return data[0];
}

export async function createConversation(title) {
    const data = await request("/conversations", {
        method: "POST",
        body: JSON.stringify({ title })
    });

    return data[0];
}

export async function getConversationMessages(conversationId) {
    return await request(`/messages?relation=eq.${conversationId}`);
}

export async function createMessage(conversationId, role, msg){

    const data = await request("/messages", {
        method: "POST",
        body: JSON.stringify({
            role: role,
            content: msg,
            relation: conversationId
        })
    });

    return data[0];
}