# 🎬 StreamVault

A modern, full-stack video streaming platform inspired by Netflix and YouTube. Built as a capstone project using **Flask**, **SQLite**, and **vanilla JavaScript** with a sleek dark theme and fully responsive design.

---

## 📸 Screenshots

> _Add screenshots of your home page, watch page, and admin panel here._

| Home Page | Watch Page | Admin Dashboard |
|-----------|------------|-----------------|
| ![Home](#) | ![Watch](#) | ![Admin](#) |

---

## 🧰 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Backend    | Python 3 / Flask                  |
| Frontend   | HTML5, CSS3, JavaScript (vanilla) |
| Database   | SQLite                            |
| Templates  | Jinja2                            |
| Fonts      | Bebas Neue, DM Sans (Google Fonts)|
| Icons      | Material Icons Round              |
| Config     | python-dotenv                     |

---

## ✨ Features

### User Side
- **Hero banner** with featured video highlight and parallax hover effect
- **Trending row** with drag-to-scroll horizontal carousel
- **Video grid** with staggered reveal animation on scroll
- **Browse page** with category filter pills (desktop) and dropdown (mobile)
- **Search** by title, description, or category with instant results
- **Watch page** with embedded player (YouTube iframe or MP4), view counter, and related videos sidebar
- **Responsive design** — mobile hamburger menu, adaptive grids, touch-friendly controls
- **Loading skeletons** for thumbnail placeholders
- **Category badges** color-coded per category

### Admin Side
- **Dashboard** with stats bar (total videos, featured count, total views, categories)
- **Inline add video form** with collapsible toggle
- **Data table** listing all videos with thumbnails, category badges, and inline actions
- **Mobile card view** for managing videos on small screens
- **Edit form** with live thumbnail preview and category autocomplete
- **Custom delete confirmation modal** with backdrop blur
- **Client-side form validation** with real-time error clearing
- **Flash messages** for success, error, and warning feedback (auto-dismiss)

---

## 📁 Folder Structure

```
capstone-project/
├── README.md
├── .gitignore
└── backend/
    ├── app.py              ← Flask application (routes, DB logic)
    ├── .env                ← Environment variables (secret key)
    ├── .env.example        ← Template for .env setup
    ├── requirements.txt    ← Python dependencies
    ├── videos.db           ← SQLite database (auto-created on first run)
    ├── templates/
    │   ├── base.html       ← Shared layout (navbar, footer, flash messages)
    │   ├── index.html      ← Home page (hero banner + video grid)
    │   ├── browse.html     ← Browse & filter by category
    │   ├── search.html     ← Search results
    │   ├── watch.html      ← Video player + related sidebar
    │   ├── admin.html      ← Admin dashboard (stats, table, add form, modal)
    │   └── edit.html       ← Add / edit video form
    └── static/
        ├── style.css       ← Dark theme, responsive layout, all styles
        ├── script.js       ← JS (nav, forms, modals, animations)
        └── images/         ← Local images (optional)
```

---

## 🌐 Routes

| Route           | Method     | Description                       |
|-----------------|------------|-----------------------------------|
| `/`             | GET        | Home page (hero + all videos)     |
| `/browse`       | GET        | Browse videos, filter by category |
| `/search`       | GET        | Search results (`?q=query`)       |
| `/watch/<id>`   | GET        | Watch a video, increments views   |
| `/admin`        | GET        | Admin dashboard — manage videos   |
| `/add`          | GET / POST | Add a new video                   |
| `/edit/<id>`    | GET / POST | Edit an existing video            |
| `/delete/<id>`  | POST       | Delete a video                    |

---

## 🗃 Database Schema

**Table: `videos`**

| Column        | Type    | Description                        |
|---------------|---------|------------------------------------|
| `id`          | INTEGER | Primary key (auto-increment)       |
| `title`       | TEXT    | Video title (required)             |
| `description` | TEXT    | Video description                  |
| `category`    | TEXT    | e.g. Documentary, Music, Education |
| `thumbnail`   | TEXT    | URL to thumbnail image             |
| `video_url`   | TEXT    | YouTube URL or direct .mp4 link    |
| `featured`    | INTEGER | 1 = featured, 0 = not featured     |
| `created_at`  | TEXT    | ISO datetime (auto-set)            |
| `views`       | INTEGER | View count (auto-incremented)      |

---

## 🚀 How to Run Locally

### Step 1 — Clone the repository
```bash
git clone https://github.com/your-username/capstone-project.git
cd capstone-project
```

### Step 2 — Create and activate a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3 — Install dependencies
```bash
pip install -r backend/requirements.txt
```

### Step 4 — Set up environment variables
```bash
cp backend/.env.example backend/.env
```

### Step 5 — Run the application
```bash
python backend/app.py
```

### Step 6 — Open in browser
```
http://localhost:5001
```

> **Note:** The database (`videos.db`) and 6 sample videos are created automatically on first run. No extra setup needed.

---

## 📦 Dependencies

| Package        | Purpose                          |
|----------------|----------------------------------|
| `Flask`        | Web framework                    |
| `python-dotenv`| Load `.env` environment variables|

---

## 🎨 Design

- **Theme:** Dark modern (Netflix-inspired)
- **Accent:** Red `#e50914`
- **Fonts:** Bebas Neue (headings) + DM Sans (body)
- **Responsive:** Hamburger menu, adaptive grids, 44px touch targets
- **Animations:** Card reveal, hover scale + shadow, shimmer skeletons, modal transitions

---

## 👤 Author

**Aarushi Kaushik**
Capstone Project

---

## 📄 License

This project is for educational purposes only.
