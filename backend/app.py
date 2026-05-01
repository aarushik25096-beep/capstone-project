"""
StreamVault – Video Streaming Platform (Backend)
Flask application with SQLite database for managing and streaming videos.
"""

import sqlite3
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    flash,
    g,
    jsonify,
)

# ---------------------------------------------------------------------------
# App configuration
# ---------------------------------------------------------------------------
app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "fallback-dev-key-change-in-production")

DATABASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "videos.db")

# ---------------------------------------------------------------------------
# Database helpers
# ---------------------------------------------------------------------------

def get_db():
    """Open a new database connection if there is none for the current request."""
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row  # return rows as dict-like objects
    return g.db


@app.teardown_appcontext
def close_db(exception):
    """Close the database connection at the end of each request."""
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    """Create the videos table if it doesn't exist and seed sample data."""
    db = get_db()
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS videos (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            title       TEXT    NOT NULL,
            description TEXT,
            category    TEXT,
            thumbnail   TEXT,
            video_url   TEXT    NOT NULL,
            featured    INTEGER DEFAULT 0,
            created_at  TEXT    DEFAULT (datetime('now')),
            views       INTEGER DEFAULT 0
        )
        """
    )
    db.commit()

    # Seed data – only insert when the table is empty
    count = db.execute("SELECT COUNT(*) FROM videos").fetchone()[0]
    if count == 0:
        seed_videos()


def seed_videos():
    """Insert sample videos on first run."""
    db = get_db()
    samples = [
        {
            "title": "Exploring the Cosmos",
            "description": "A breathtaking journey through our solar system and beyond. Witness stunning visuals of distant galaxies, nebulae, and the wonders of deep space.",
            "category": "Documentary",
            "thumbnail": "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=720&q=80",
            "video_url": "https://www.w3schools.com/html/mov_bbb.mp4",
            "featured": 1,
        },
        {
            "title": "Mountain Sunrise Timelapse",
            "description": "Watch the sun rise over snow-capped peaks in this mesmerising 4K timelapse captured across three seasons in the Swiss Alps.",
            "category": "Nature",
            "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=720&q=80",
            "video_url": "https://www.w3schools.com/html/mov_bbb.mp4",
            "featured": 1,
        },
        {
            "title": "Introduction to Web Development",
            "description": "Learn the fundamentals of HTML, CSS, and JavaScript in this beginner-friendly crash course. Perfect for aspiring developers.",
            "category": "Education",
            "thumbnail": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=720&q=80",
            "video_url": "https://www.w3schools.com/html/mov_bbb.mp4",
            "featured": 0,
        },
        {
            "title": "Urban Street Photography Tips",
            "description": "Master the art of street photography with composition techniques, lighting tricks, and gear recommendations from a professional photographer.",
            "category": "Photography",
            "thumbnail": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=720&q=80",
            "video_url": "https://www.w3schools.com/html/mov_bbb.mp4",
            "featured": 0,
        },
        {
            "title": "Cooking Italian Pasta from Scratch",
            "description": "Follow along as Chef Marco prepares authentic hand-made pasta with a rich bolognese sauce using traditional Italian methods.",
            "category": "Cooking",
            "thumbnail": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=720&q=80",
            "video_url": "https://www.w3schools.com/html/mov_bbb.mp4",
            "featured": 1,
        },
        {
            "title": "Lo-Fi Beats to Study To",
            "description": "Relax and focus with this curated collection of lo-fi hip-hop beats. Perfect background music for studying, coding, or unwinding.",
            "category": "Music",
            "thumbnail": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=720&q=80",
            "video_url": "https://www.w3schools.com/html/mov_bbb.mp4",
            "featured": 0,
        },
    ]
    for v in samples:
        db.execute(
            """
            INSERT INTO videos (title, description, category, thumbnail, video_url, featured)
            VALUES (:title, :description, :category, :thumbnail, :video_url, :featured)
            """,
            v,
        )
    db.commit()


# ---------------------------------------------------------------------------
# Query helpers
# ---------------------------------------------------------------------------

def get_all_videos():
    """Return every video, newest first."""
    db = get_db()
    return db.execute("SELECT * FROM videos ORDER BY created_at DESC").fetchall()


def get_video_by_id(video_id):
    """Return a single video by its primary key, or None."""
    db = get_db()
    return db.execute("SELECT * FROM videos WHERE id = ?", (video_id,)).fetchone()


def get_featured_videos():
    """Return all videos marked as featured."""
    db = get_db()
    return db.execute(
        "SELECT * FROM videos WHERE featured = 1 ORDER BY created_at DESC"
    ).fetchall()


def search_videos(query):
    """Full-text search across title, description, and category."""
    db = get_db()
    like = f"%{query}%"
    return db.execute(
        """
        SELECT * FROM videos
        WHERE title LIKE ? OR description LIKE ? OR category LIKE ?
        ORDER BY created_at DESC
        """,
        (like, like, like),
    ).fetchall()


def filter_by_category(category):
    """Return all videos matching a given category."""
    db = get_db()
    return db.execute(
        "SELECT * FROM videos WHERE category = ? ORDER BY created_at DESC",
        (category,),
    ).fetchall()


def get_categories():
    """Return a sorted list of distinct categories."""
    db = get_db()
    rows = db.execute(
        "SELECT DISTINCT category FROM videos WHERE category IS NOT NULL ORDER BY category"
    ).fetchall()
    return [row["category"] for row in rows]


# ---------------------------------------------------------------------------
# Routes – Public
# ---------------------------------------------------------------------------

@app.route("/")
def index():
    """Homepage – featured videos + recent uploads."""
    featured = get_featured_videos()
    videos = get_all_videos()
    return render_template("index.html", featured=featured, videos=videos)


@app.route("/watch/<int:video_id>")
def watch(video_id):
    """Individual video watch page. Increments view counter."""
    video = get_video_by_id(video_id)
    if video is None:
        flash("Video not found.", "error")
        return redirect(url_for("index"))

    # Increment views
    db = get_db()
    db.execute("UPDATE videos SET views = views + 1 WHERE id = ?", (video_id,))
    db.commit()

    # Refresh to get updated view count
    video = get_video_by_id(video_id)

    # Suggest related videos from the same category (excluding current)
    related = db.execute(
        "SELECT * FROM videos WHERE category = ? AND id != ? ORDER BY views DESC LIMIT 4",
        (video["category"], video_id),
    ).fetchall()

    return render_template("watch.html", video=video, related=related)


@app.route("/search")
def search():
    """Search results page."""
    query = request.args.get("q", "").strip()
    results = search_videos(query) if query else []
    return render_template("search.html", query=query, results=results)


@app.route("/browse")
def browse():
    """Browse videos, optionally filtered by category."""
    category = request.args.get("category", "").strip()
    categories = get_categories()
    if category:
        videos = filter_by_category(category)
    else:
        videos = get_all_videos()
    return render_template(
        "browse.html",
        videos=videos,
        categories=categories,
        selected_category=category,
    )


# ---------------------------------------------------------------------------
# Routes – Admin
# ---------------------------------------------------------------------------

@app.route("/admin")
def admin():
    """Admin dashboard – manage all videos."""
    videos = get_all_videos()
    return render_template("admin.html", videos=videos)


@app.route("/add", methods=["GET", "POST"])
def add():
    """Add a new video."""
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        description = request.form.get("description", "").strip()
        category = request.form.get("category", "").strip()
        thumbnail = request.form.get("thumbnail", "").strip()
        video_url = request.form.get("video_url", "").strip()
        featured = 1 if request.form.get("featured") else 0

        # Basic validation
        if not title or not video_url:
            flash("Title and Video URL are required.", "error")
            return redirect(url_for("add"))

        db = get_db()
        db.execute(
            """
            INSERT INTO videos (title, description, category, thumbnail, video_url, featured)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (title, description, category, thumbnail, video_url, featured),
        )
        db.commit()
        flash(f'Video "{title}" added successfully!', "success")
        return redirect(url_for("admin"))

    categories = get_categories()
    return render_template("edit.html", video=None, categories=categories)


@app.route("/edit/<int:video_id>", methods=["GET", "POST"])
def edit(video_id):
    """Edit an existing video."""
    video = get_video_by_id(video_id)
    if video is None:
        flash("Video not found.", "error")
        return redirect(url_for("admin"))

    if request.method == "POST":
        title = request.form.get("title", "").strip()
        description = request.form.get("description", "").strip()
        category = request.form.get("category", "").strip()
        thumbnail = request.form.get("thumbnail", "").strip()
        video_url = request.form.get("video_url", "").strip()
        featured = 1 if request.form.get("featured") else 0

        if not title or not video_url:
            flash("Title and Video URL are required.", "error")
            return redirect(url_for("edit", video_id=video_id))

        db = get_db()
        db.execute(
            """
            UPDATE videos
            SET title = ?, description = ?, category = ?, thumbnail = ?,
                video_url = ?, featured = ?
            WHERE id = ?
            """,
            (title, description, category, thumbnail, video_url, featured, video_id),
        )
        db.commit()
        flash(f'Video "{title}" updated successfully!', "success")
        return redirect(url_for("admin"))

    categories = get_categories()
    return render_template("edit.html", video=video, categories=categories)


@app.route("/delete/<int:video_id>", methods=["POST"])
def delete(video_id):
    """Delete a video (POST only for safety)."""
    video = get_video_by_id(video_id)
    if video is None:
        flash("Video not found.", "error")
        return redirect(url_for("admin"))

    db = get_db()
    db.execute("DELETE FROM videos WHERE id = ?", (video_id,))
    db.commit()
    flash(f'Video "{video["title"]}" deleted.', "warning")
    return redirect(url_for("admin"))


# ---------------------------------------------------------------------------
# Error handlers
# ---------------------------------------------------------------------------

@app.errorhandler(404)
def page_not_found(e):
    """Custom 404 page."""
    return render_template("index.html", featured=[], videos=[], error_404=True), 404


# ---------------------------------------------------------------------------
# App initialisation
# ---------------------------------------------------------------------------

with app.app_context():
    init_db()

if __name__ == "__main__":
    debug_mode = os.environ.get("FLASK_DEBUG", "False").lower() in ("true", "1", "yes")
    port = int(os.environ.get("FLASK_PORT", 5000))
    app.run(debug=debug_mode, port=port)
