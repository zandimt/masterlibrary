import { booksApi } from "../services/api";

const STATUS_LABELS = {
    want: "Want to Read",
    reading: "Currently Reading",
    read: "Read",
};

const STATUS_CYCLE = {
    want: "reading",
    reading: "read",
    read: "want",
};

export function BookCard({ book, onUpdate, onRemove }) {
    const handleStatusChange = async (e) => {
        await onUpdate(book.id, { status: e.target.value });
    };

    return (
        <div className={`book-card status-${book.status}`}>
            {book.cover_url && <img src={book.cover_url} alt={book.title} />}
            <div className="book-info">
                <strong>{book.title}</strong>
                {book.author && <p>{book.author}</p>}
                {book.published_year && <p>{book.published_year}</p>}
                <select value={book.status} onChange={handleStatusChange}>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
                <button onClick={() => onRemove(book.id)} className="remove-btn">
                    Remove
                </button>
            </div>
        </div>
    );
}