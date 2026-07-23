const API_URL = "https://api.mistral.ai/v1/chat/completions";

export async function askMistral(token, question) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            model: "mistral-medium",
            messages: [
                {
                    role: "user",
                    content: question
                }
            ],
            temperature: 0.7,
            max_tokens: 1500
        })
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();

    return data.choices[0].message.content;
}
