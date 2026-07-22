const STORAGE_KEY = "token";

export const tokenManager = {
    get() {
        return localStorage.getItem(STORAGE_KEY);
    },

    save(token) {
        localStorage.setItem(STORAGE_KEY, token);
    },

    remove() {
        localStorage.removeItem(STORAGE_KEY);
    },

    ensure() {
        let token = this.get();

        if (!token) {
            token = prompt("Token Mistral :");

            if (token) {
                this.save(token);
            }
        }

        return token;
    }
};