import { useState, useEffect, useCallback } from "react";
import { booksApi } from "../services/api";

export function useBooks(statusFilter = "") {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await booksApi.list(statusFilter);
            setBooks(data);
        } catch (err) {
            setError(err.detail);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const addBook = async (bookData) => {
        const created = await booksApi.create(bookData);
        setBooks((prev) => [created, ...prev]);
        return created;
    };

    const updateBook = async (id, data) => {
        const updated = await booksApi.update(id, data);
        setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
        return updated;
    };

    const removeBook = async (id) => {
        await booksApi.remove(id);
        setBooks((prev) => prev.filter((b) => b.id !== id));
    };

    return { books, loading, error, addBook, updateBook, removeBook, refetch: fetchBooks };
}