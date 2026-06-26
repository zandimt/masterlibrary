import { useState } from "react";
import { useBooks } from "../hooks/useBooks";
import { AddBookForm } from "../components/AddBooksForm.jsx";
import { BookCard } from "../components/BookCard";

const FILTERS = [
    { value: "", label: "All" },
    { value: "want", label: "Want to Read" },
    { value: "reading", label: "Reading" },
    { value: "read", label: "Read" },
];

export function BookshelfPage() {
    const [statusFilter, setStatusFilter] = useState("");
    const [showForm, setShowForm] = useState(false);
    const { books, loading, error, addBook, updateBook, removeBook } = useBooks(statusFilter);

    const handleAdd = async (bookData) => {
        await addBook(bookData);
        setShowForm(false);
    };

    return (
        <main>
            <header>
                <h1>My Bookshelf</h1>
                <button onClick={() => setShowForm((v) => !v)}>
                    {showForm ? "Cancel" : "+ Add Book"}
                </button>
            </header>

            {showForm && <AddBookForm onAdd={handleAdd} />}

            <nav className="filters">
                {FILTERS.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setStatusFilter(f.value)}
                        className={statusFilter === f.value ? "active" : ""}
                    >
                        {f.label}
                    </button>
                ))}
            </nav>

            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            <div className="book-grid">
                {books.map((book) => (
                    <BookCard
                        key={book.id}
                        book={book}
                        onUpdate={updateBook}
                        onRemove={removeBook}
                    />
                ))}
                {!loading && books.length === 0 && <p>No books here yet.</p>}
            </div>
        </main>
    );
}