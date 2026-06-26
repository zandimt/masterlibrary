import requests

OPEN_LIBRARY_URL = "https://openlibrary.org/api/books"


def lookup_isbn(isbn: str) -> dict | None:
    """
    Fetch book metadata from Open Library by ISBN.
    Returns a dict of book fields on success, None if not found.
    """
    params = {
        "bibkeys": f"ISBN:{isbn}",
        "format": "json",
        "jscmd": "data",
    }

    try:
        response = requests.get(OPEN_LIBRARY_URL, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException:
        return None

    key = f"ISBN:{isbn}"
    if key not in data:
        return None

    book = data[key]

    authors = book.get("authors", [])
    author_str = ", ".join(a.get("name", "") for a in authors)

    cover = book.get("cover", {})
    cover_url = cover.get("large") or cover.get("medium") or ""

    publish_date = book.get("publish_date", "")
    year = None
    if publish_date:
        # publish_date can be "2001", "January 2001", "Jan 15, 2001", etc.
        for part in publish_date.split():
            if part.isdigit() and len(part) == 4:
                year = int(part)
                break

    return {
        "isbn": isbn,
        "title": book.get("title", ""),
        "author": author_str,
        "cover_url": cover_url,
        "published_year": year,
    }