<script>
    import SvelteMarkdown from "@humanspeak/svelte-markdown";

    let {
        messages,
        menuVisible,
        loading,
        onSend
    } = $props();

    let question = $state("");


    async function handleSubmit(event) {
        event.preventDefault();

        const content = question.trim();

        if (!content || loading) {
            return;
        }

        question = "";

        await onSend(content);
    }
</script>


<main class:full-height={!menuVisible}>

    <div>

        {#each messages as msg}

            <section class={msg.role}>

                <div>
                    <SvelteMarkdown source={msg.content} />
                </div>

                <div>
                    {msg.created_at}
                </div>

            </section>

        {/each}

    </div>


    <div>

        <form onsubmit={handleSubmit}>

            <input
                bind:value={question}
                type="text"
                placeholder="Envoyer un message"
                disabled={loading}
            />

            <button
                id="envoyer"
                type="submit"
                disabled={loading}
            >
                {loading ? "..." : "Envoyer"}
            </button>

        </form>

    </div>

</main>