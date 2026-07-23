<script>
    let {
        conversations,
        conversationId,
        convTitle,
        onSelect,
        onDelete,
        onCreate
    } = $props();

    let title = $state(convTitle ?? "");

    async function handleSubmit(event) {
        event.preventDefault();

        const value = title.trim();

        if (!value) {
            return;
        }

        await onCreate(value);

        title = "";
    }
</script>


<header>
    <h1>
        Conversations
        <span style="font-size: xx-small;">
            v0.1.0
        </span>
    </h1>


    <section id="conversations">

        {#each conversations as conversation}

            <div>

                <button
                    class:active={conversation.id === conversationId}
                    onclick={() => onSelect(conversation.id)}
                >
                    {conversation.title}
                </button>

                <button
                    onclick={() => onDelete(conversation.id)}
                >
                    x
                </button>

            </div>

        {/each}

    </section>


    <form onsubmit={handleSubmit}>

        <input
            bind:value={title}
            type="text"
            placeholder="Nouvelle conversation"
        />

        <button type="submit">
            Créer
        </button>

    </form>

</header>