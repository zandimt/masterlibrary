const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw { status: res.status, detail: error.detail ?? "Something went wrong." };
    }

    // 204 No Content (DELETE) has no body
    if (res.status === 204) return null;
    return res.json();
}

export const booksApi = {
    list: (status) => {
        const query = status ? `?status=${status}` : "";
        return request(`/books/${query}`);
    },
    lookup: (isbn) => request(`/books/lookup/?isbn=${isbn}`),
    create: (data) => request("/books/", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) =>
        request(`/books/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
    remove: (id) => request(`/books/${id}/`, { method: "DELETE" }),
};