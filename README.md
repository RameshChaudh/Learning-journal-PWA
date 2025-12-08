# 🎓 Learning Journal PWA: Offline-Capable & Installable

This project is a Progressive Web Application (PWA) built by **Ramesh Chaudhary** for the FGCT6021 Mobile Application Development unit. It has evolved from a simple static site into a full-stack application that works offline.

## ✨ Project Overview

The application utilizes a **Flask backend** deployed on PythonAnywhere for robust data management and implements modern PWA standards to behave like a native mobile app.

### 🌟 Key Features

* **📱 Fully Installable:** Users can install the app to their home screen (Custom "Install App" Button feature).
* **📡 Offline Support:** Uses a **Service Worker** with a "Network First" strategy. The app tries to fetch fresh data but falls back to the cache if offline.
* **💾 Dual Persistence:** Saves data to a server-side JSON file (`reflections.json`) while also using LocalStorage for UI speed.
* **🔌 API Integration:** Full REST API (GET, POST, DELETE) connecting the JavaScript frontend to the Python backend.

---

## 🚀 Live Application & Deployment

| Link Type | URL | Notes |
| :--- | :--- | :--- |
| **Live PWA** | `https://ramesh32.pythonanywhere.com/` | Fully functional PWA with offline capabilities. |
| **GitHub Repo** | `https://github.com/Rameshchaudh/Learning-journal-PWA` | Complete source code including Flask and Service Worker. |

---

## Project Structure 
```

Learning-journal-PWA/
├── flask_app.py            # Main Flask application (Backend)
├── templates/              # HTML pages
│   ├── index.html
│   ├── journal.html
│   ├── projects.html
│   └── about.html
├── static/
│   ├── manifest.json       # PWA Manifest (Identity & Icons)
│   ├── css/
│   │   └── style.css       # Styles
│   ├── js/
│   │   ├── sw.js           # Service Worker (Offline Logic)
│   │   ├── script.js       # Navigation, Theme, Install Logic
│   │   ├── browser.js      # Browser API Logic
│   │   ├── storage.js      # LocalStorage Logic
│   │   └── thirdparty.js   # Third-Party API Logic
│   ├── images/             # App Icons (1.png, temp.webp)
│   └── backend/
│       └── reflections.json # Data storage (Created automatically)

```

# Clone the repository
git clone [https://github.com/Rameshchaudh/Learning-journal-PWA.git](https://github.com/Rameshchaudh/Learning-journal-PWA.git)

# Go into the folder
cd Learning-journal-PWA

# Install Flask
pip install flask

python flask_app.py
