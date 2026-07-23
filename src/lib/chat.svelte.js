import { tokenManager } from "$lib/token";
import { askMistral } from "$lib/api/mistral";

import {
    createConversation,
    deleteConversation,
    getConversationMessages,
    getConversations,
    createMessage
} from "$lib/services/conversations";


export const chat = $state({
    conversationId: "",
    conversations: [],
    messages: [],
    menuVisible: true,
    loading: false
});


export async function initialize() {
    tokenManager.ensure();

    chat.conversations = await getConversations();

    if (chat.conversations.length === 0) {
        return;
    }

    await selectConversation(
        chat.conversations[
            chat.conversations.length - 1
        ].id
    );
}


export function toggleMenu() {
    chat.menuVisible = !chat.menuVisible;
}


export async function createNewConversation(title) {

    try {

        const conversation =
            await createConversation(title);

        chat.conversations = [
            ...chat.conversations,
            conversation
        ];

        await selectConversation(
            conversation.id
        );

    } catch (error) {

        console.error(
            "Impossible de créer la conversation :",
            error
        );

    }
}


export async function selectConversation(id) {

    if (!id) {

        chat.conversationId = "";
        chat.messages = [];

        return;
    }

    chat.conversationId = id;

    try {

        chat.messages =
            await getConversationMessages(id);

    } catch (error) {

        console.error(
            "Impossible de charger les messages :",
            error
        );

        chat.messages = [];
    }
}


export async function deleteConv(id) {

    const confirmed = confirm(
        "Voulez-vous vraiment supprimer cette conversation ?"
    );

    if (!confirmed) {
        return;
    }

    try {

        await deleteConversation(id);

        chat.conversations =
            chat.conversations.filter(
                conversation =>
                    conversation.id !== id
            );


        const nextConversation =
            chat.conversations[
                chat.conversations.length - 1
            ];


        if (nextConversation) {

            await selectConversation(
                nextConversation.id
            );

        } else {

            chat.conversationId = "";
            chat.messages = [];

        }

    } catch (error) {

        console.error(
            "Impossible de supprimer la conversation :",
            error
        );

    }
}


export async function sendMessage(content) {

    if (!content || chat.loading) {
        return;
    }

    try {

        chat.loading = true;

        await ensureConversation();


        const userMessage =
            await createMessage(
                chat.conversationId,
                "human",
                content
            );


        chat.messages = [
            ...chat.messages,
            userMessage
        ];


        const answer =
            await askMistral(
                tokenManager.ensure(),
                content
            );


        const aiMessage =
            await createMessage(
                chat.conversationId,
                "ia",
                answer
            );


        chat.messages = [
            ...chat.messages,
            aiMessage
        ];


    } catch (error) {

        console.error(
            "Erreur lors de l'envoi du message :",
            error
        );

    } finally {

        chat.loading = false;

    }
}


async function ensureConversation() {

    if (chat.conversationId) {
        return;
    }


    const conversation =
        await createConversation("default");


    chat.conversations = [
        ...chat.conversations,
        conversation
    ];


    chat.conversationId =
        conversation.id;

    chat.messages = [];
}