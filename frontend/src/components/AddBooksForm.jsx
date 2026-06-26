import { useState } from "react";
import { booksApi } from "../services/api";

export function AddBookForm({ onAdd }) {
    const [isbn, setIsbn] = useState("");
    const [preview, setPreview] = useState(null);
    const [lookupError, setLookupError] = useState(null);
    const [isLooking, setIsLooking] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const handleLookup = async (e) => {
        e.preventDefault();
        setLookupError(null);
        setPreview(null);
        setIsLooking(true);
        try {
            const data = await booksApi.lookup(isbn.trim());
            setPreview(data);
        } catch (err) {
            setLookupError(err.detail);
        } finally {
            setIsLooking(false);
        }
    };

    const handleAdd = async () => {
        setIsAdding(true);
        try {
            await onAdd({ ...preview, status: "want" });
            setIsbn("");
            setPreview(null);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="add-book-form">
            <form onSubmit={handleLookup}>
                <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    placeholder="Enter ISBN (e.g. 9780140449136)"
                    required
                />
                <button type="submit" disabled={isLooking}>
                    {isLooking ? "Looking up..." : "Look up"}
                </button>
            </form>

            {lookupError && <p className="error">{lookupError}</p>}

            {preview && (
                <div className="book-preview">
                    {preview.cover_url && <img src={preview.cover_url} alt={preview.title} />}
                    <div>
                        <strong>{preview.title}</strong>
                        <p>{preview.author}</p>
                        {preview.published_year && <p>{preview.published_year}</p>}
                        <button onClick={handleAdd} disabled={isAdding}>
                            {isAdding ? "Adding..." : "Add to collection"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}