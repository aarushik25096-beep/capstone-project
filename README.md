# 🎬 StreamVault

A modern, full-stack video streaming platform inspired by Netflix and YouTube. Built as a capstone project using Flask, SQLite, and vanilla JavaScript.

---

## 📸 Screenshots

> _Add screenshots of your home page, watch page, and admin panel here._

---

## 🧰 Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Backend    | Python / Flask          |
| Frontend   | HTML, CSS, JavaScript   |
| Database   | SQLite                  |
| Templates  | Jinja2                  |
| Fonts      | Bebas Neue, DM Sans     |
| Icons      | Material Icons Round    |

---

## ✨ Features

**User Side**
- Hero banner with featured video highlight
- Trending / featured videos row with drag-to-scroll
- Full video grid with card hover effects
- Browse page with category filter (pills on desktop, dropdown on mobile)
- Search by title, description, or category
- Watch page with embedded video player (YouTube iframe or MP4)
- Related videos sidebar on watch page
- View counter per video

**Admin Side**
- Add new videos (title, description, category, thumbnail URL, video URL, featured toggle)
- Edit existing videos
- Delete videos with confirmation
- Flash messages for all actions (success / error / warning)

---

## 📁 Folder Structure

```
capstone-project/
└── backend/
    ├── app.py              ← Flask app, routes, DB logic
    ├── videos.db           ← SQLite database (auto-created)
    ├── templates/
    │   ├── base.html       ← Shared layout (navbar, footer, flash)
    │   ├── index.html      ← Home page
    │   ├── browse.html     ← Browse & filter by category
    │   ├── search.html     ← Search results
    │   ├── watch.html      ← Video player page
    │   ├── admin.html      ← Admin dashboard
    │   └── edit.html       ← Add / edit video form
    └── static/
        ├── style.css       ← Dark theme, responsive layout
        ├── script.js       ← JS interactions
        └── images/         ← Local images (optional)
```

---

## 🌐 Routes

| Route              | Method     | Description              |
|--------------------|------------|--------------------------|
| `/`                | GET        | Home page                |
| `/browse`          | GET        | Browse & filter videos   |
| `/search`          | GET        | Search results           |
| `/watch/<id>`      | GET        | Watch a video            |
| `/admin`           | GET        | Admin dashboard          |
| `/add`             | GET / POST | Add a new video          |
| `/edit/<id>`       | GET / POST | Edit an existing video   |
| `/delete/<id>`     | POST       | Delete a video           |

---

## 🗃 Database Schema

**Table: `videos`**

| Column       | Type     | Description                    |
|--------------|----------|--------------------------------|
| `id`         | INTEGER  | Primary key (auto-increment)   |
| `title`      | TEXT     | Video title                    |
| `description`| TEXT     | Video description              |
| `category`   | TEXT     | e.g. Documentary, Music        |
| `thumbnail`  | TEXT     | URL to thumbnail image         |
| `video_url`  | TEXT     | YouTube embed URL or MP4 link  |
| `featured`   | INTEGER  | 1 = featured, 0 = not featured |
| `created_at` | TEXT     | ISO datetime string            |
| `views`      | INTEGER  | View count (auto-incremented)  |

---

## 🚀 How to Run Locally

**1. Clone the repository**
```bash
git clone https://github.com/your-username/streamvault.git
cd streamvault/backend
```

**2. Create a virtual environment**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac / Linux
source venv/bin/activate
```

**3. Install dependencies**
```bash
pip install flask
```

**4. Run the app**
```bash
python app.py
```

**5. Open in your browser**
```
http://localhost:5000
```

> The database and sample videos are created automatically on first run. No setup needed.

---

## 📦 Dependencies

```
flask
```

Install with:
```bash
pip install flask
```

Or generate a requirements file:
```bash
pip freeze > requirements.txt
```

---

## 🎨 UI Design

- **Theme:** Dark modern (Netflix-inspired)
- **Accent color:** Red `#e50914`
- **Fonts:** Bebas Neue (headings) + DM Sans (body)
- **Responsive:** Mobile-first, works on all screen sizes
- **Animations:** Card reveal on scroll, hover effects, hero parallax

---

## 👤 Author

**Your Name**
Capstone Project — [Your Course / Institution Name]
[Year]

---

## 📄 License

This project is for educational purposes only.
