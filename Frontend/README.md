# 🎬 Video Streaming Platform

A responsive video streaming platform with a full-featured admin panel for content management. Built as a front-end web project with a dark-themed admin dashboard.

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure |
| CSS3 | Styling, animations, responsive design |
| Vanilla JavaScript | DOM manipulation, localStorage CRUD |
| Google Fonts (Poppins) | Typography |

## How to Run Locally

No build tools or server required — open directly in any modern browser:

```bash
# Clone or download the project
cd WEBdev_project_1

# Option A: Open directly
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux

# Option B: Use a local server (recommended for best experience)
# Python 3
python -m http.server 8000
# Then visit http://localhost:8000

# Option C: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

## Folder Structure

```
WEBdev_project_1/
├── index.html          # Main landing page
├── admin.html          # Admin dashboard (add video, video table)
├── edit.html           # Edit video form (pre-filled)
├── styles.css          # Landing page styles
├── admin-styles.css    # Admin panel dark theme styles
├── script.js           # Admin JS (CRUD, validation, flash messages)
├── README.md           # Project documentation
└── Recources/          # Images and icons
    ├── LOGO.png
    ├── IMG.png
    └── ...
```

## Routes / Pages

| Page | URL | Description |
|---|---|---|
| Home | `index.html` | Landing page with hero, features, footer |
| Admin Dashboard | `admin.html` | Add videos, view/search table, delete with confirmation |
| Edit Video | `edit.html?id=<id>` | Pre-filled edit form for a specific video |

### Admin Features

- **Add Video** — Form with title, description, category, thumbnail URL, embed URL, featured toggle
- **Video Table** — Lists all videos with thumbnail preview, category badge, and date
- **Edit** — Pre-filled form with live preview card
- **Delete** — Confirmation modal dialog before removal
- **Search** — Real-time filtering across title, category, and description
- **Flash Messages** — Success/error toasts with auto-dismiss
- **Form Validation** — Required fields, URL format, minimum length checks
- **Stats Dashboard** — Total videos, featured count, unique categories

## Screenshots

> Screenshots to be added after final review.

| Page | Screenshot |
|---|---|
| Landing Page | _placeholder_ |
| Admin Dashboard | _placeholder_ |
| Edit Video | _placeholder_ |
| Mobile View | _placeholder_ |

## Author

**Shivam Jahane**
Enrollment No: 2502140075

---

© Programming Pathshala — All Rights Reserved
