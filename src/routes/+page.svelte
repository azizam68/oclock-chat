<script>
    import { tokenManager } from "$lib/token";
    import { onMount } from "svelte";
    import SvelteMarkdown from "@humanspeak/svelte-markdown";

    let conversationId = $state("");
    let conversations = $state([]);
    let messages = $state([]);

    let token = null;
    let menuVisible = $state(true);

    function toggleMenu() {
        menuVisible = !menuVisible;
    }
    
    onMount(async () => {
        
        token = tokenManager.ensure();

        let headersList = {
            apikey: "sb_publishable_6ghal1j3MjMFz3bd7bjV5A_M-wOjNFR",
            Authorization:
                "Bearer sb_publishable_6ghal1j3MjMFz3bd7bjV5A_M-wOjNFR",
        };

        let response = await fetch(
            "https://cugrlbcroozcdurleacr.supabase.co/rest/v1/conversations",
            {
                method: "GET",
                headers: headersList,
            },
        );

        let data = await response.json();

        if (data.length > 0) {
            conversations.push(...data);
            loadConv(data[data.length - 1]);
            conversationId = conversations[conversations.length - 1].id;
        }
    });

    async function loadConv(conv) {
        let headersList = {
            apikey: "sb_publishable_6ghal1j3MjMFz3bd7bjV5A_M-wOjNFR",
            Authorization:
                "Bearer sb_publishable_6ghal1j3MjMFz3bd7bjV5A_M-wOjNFR",
        };
        let response = await fetch(
            `https://cugrlbcroozcdurleacr.supabase.co/rest/v1/messages?relation=eq.${conv.id}`,
            {
                method: "GET",
                headers: headersList,
            },
        );

        let data = await response.json();

        messages = data.length > 0 ? data : [];
    }

    async function chatUpdate(role, msg) {
        let headersList = {
            Accept: "*/*",
            apikey: "sb_publishable_6ghal1j3MjMFz3bd7bjV5A_M-wOjNFR",
            Prefer: "return=representation",
            Authorization:
                "Bearer sb_publishable_6ghal1j3MjMFz3bd7bjV5A_M-wOjNFR",
            "Content-Type": "application/json",
        };

        let bodyContent = JSON.stringify({
            role: role,
            content: msg,
            relation: conversationId
        });
        try {
            let response = await fetch(
                `https://cugrlbcroozcdurleacr.supabase.co/rest/v1/messages?id=eq.${conversationId}`,
                {
                    method: "POST",
                    body: bodyContent,
                    headers: headersList,
                },
            );

            let data = await response.json();

            messages.push(data[0]);
        } catch (err) {
            console.error(err);
        }
    }

    async function chatMajHuman(chatMsg) {
        await chatUpdate("human", chatMsg.human.txt)
    }

    async function chatMaj(chatMsg) {
        await chatUpdate("ia", chatMsg.bot)
    }

    async function newConv(convTitle) {
        let headersList = {
            apikey: "sb_publishable_6ghal1j3MjMFz3bd7bjV5A_M-wOjNFR",
            Prefer: "return=representation",
            Authorization:
                "Bearer sb_publishable_6ghal1j3MjMFz3bd7bjV5A_M-wOjNFR",
            "Content-Type": "application/json",
        };

        let bodyContent = JSON.stringify({
            title: convTitle,
        });

        try {
            let response = await fetch(
                "https://cugrlbcroozcdurleacr.supabase.co/rest/v1/conversations",
                {
                    method: "POST",
                    body: bodyContent,
                    headers: headersList,
                },
            );

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();
            if (data.length > 0) {
                conversations.push(data[0]);
                conversationId = data[0].id;
                messages = [];
            }
        } catch (error) {
            console.error("Erreur :", error);
        }
    }

    async function handleSubmitConv(event) {
        event.preventDefault();

        var convTitle = document.getElementById("convTitle");

        if (!convTitle.value) return;
        await newConv(convTitle.value);

        convTitle.value = "";
    }
    async function handleSubmit(event) {
        event.preventDefault();

        if (conversationId.length < 1) {
            await newConv("default");
        }

        var theQuestionEle = document.getElementById("theQuestion");

        if (!theQuestionEle.value) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        const chatHumanMsg = {
            human: { txt: theQuestionEle.value, txt_time: timeString },
        };

        await chatMajHuman(chatHumanMsg);

        const url = "https://api.mistral.ai/v1/chat/completions";
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                model: "mistral-medium",
                messages: [{ role: "user", content: theQuestionEle.value }],
                temperature: 0.7,
                max_tokens: 1500,
            }),
        };

        theQuestionEle.value = "";

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            const data = await response.json();

            const chatMsg = {
                bot: data.choices[0].message.content,
            };
            await chatMaj(chatMsg);
        } catch (error) {
            console.error("Erreur :", error);
        }
    }
    const activateConv = (e) => {
        const btns = document.querySelectorAll("#conversations button");
        btns.forEach((b) => {
            b.style.backgroundColor = "white";
        });

        btns.forEach((b) => {
            b.style.backgroundColor = "white";
        });

        conversationId = e.target.value;

        e.target.style.backgroundColor = "red";
        loadConv({ id: conversationId });
    };
    let deleteConv = async (e) => {
        conversationId = e.target.value;

        const isConf = confirm("supprimer ?");
        if (!isConf) return;

        try {
            let headersList = {
                "apikey": "sb_publishable_6ghal1j3MjMFz3bd7bjV5A_M-wOjNFR",
                "Prefer": "return=representation",
                "Authorization": "Bearer sb_publishable_6ghal1j3MjMFz3bd7bjV5A_M-wOjNFR"
            }

            let response = await fetch(`https://cugrlbcroozcdurleacr.supabase.co/rest/v1/conversations?id=eq.${conversationId}`, { 
            method: "DELETE",
            headers: headersList
            });

            if (response.status == 200) {
                const index = conversations.findIndex(
                    (c) => c.id == conversationId,
                );
                conversations.splice(index, 1);
            }
            conversationId =
                conversations.length > 0
                    ? conversations[conversations.length - 1].id
                    : "";
            messages = []
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

</script>

<div id="app">
    <button type="button" on:click={toggleMenu}>=</button>
    {#if menuVisible}
    <header>
        <h1>Conversations<span style="font-size: xx-small;"> v0.1.0</span></h1>
        
        <section id="conversations">
            {#each conversations as conv}
                <div>
                    <button
                        style:background-color={conversationId === conv.id
                            ? "red"
                            : "#999"}
                        type="button"
                        on:click={(e) => activateConv(e)}
                        value={conv.id}>{conv.title}</button
                    >
                    <button
                        type="button"
                        on:click={(e) => deleteConv(e)}
                        value={conv.id}>x</button
                    >
                </div>
            {/each}
        </section>
        <form id="createConv" on:submit={async (e) => handleSubmitConv(e)}>
            <input
                type="text"
                placeholder="Nouvelle conversation"
                id="convTitle"
            />
            <button type="submit">Creer</button>
        </form>
    </header>
    {/if}
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
            <form id="sendForm" on:submit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Envoyer un message"
                    id="theQuestion"
                />
                <button id="envoyer"> Envoyer </button>
            </form>
        </div>
    </main>
    <footer></footer>
</div>
