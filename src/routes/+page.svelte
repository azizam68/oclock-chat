<script>
    import { onMount } from "svelte";

    import ConversationSidebar from "$lib/components/ConversationSidebar.svelte";
    import ChatWindow from "$lib/components/ChatWindow.svelte";

    import {
        chat,
        initialize,
        toggleMenu,
        selectConversation,
        deleteConv,
        createNewConversation,
        sendMessage
    } from "$lib/chat.svelte.js";


    onMount(initialize);
</script>


<div id="app">

    <button
        type="button"
        onclick={toggleMenu}
    >
        =
    </button>


    {#if chat.menuVisible}

        <ConversationSidebar
            conversations={chat.conversations}
            conversationId={chat.conversationId}
            onSelect={selectConversation}
            onDelete={deleteConv}
            onCreate={createNewConversation}
        />

    {/if}


    <ChatWindow
        messages={chat.messages}
        menuVisible={chat.menuVisible}
        loading={chat.loading}
        onSend={sendMessage}
    />


    <footer></footer>

</div>