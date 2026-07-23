const URL = "https://cugrlbcroozcdurleacr.supabase.co/rest/v1/";
const KEY = "sb_publishable_6ghal1j3MjMFz3bd7bjV5A_M-wOjNFR";

const headers = {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation"
};

export async function request(path, options = {}) {

    const response = await fetch(`${URL}${path}`, {
        headers,
        ...options
    });

    if (!response.ok) {
        throw new Error(response.status);
    }

    return await response.json();
}
