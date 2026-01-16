from flask import Flask, request, jsonify, render_template, send_from_directory, make_response
import json, os
from datetime import datetime

app = Flask(__name__)

# --- Configuration ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "static", "backend", "reflections.json")

# --- Helper Functions ---
def load_reflections():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r") as f:
                return json.load(f)
        except json.JSONDecodeError:
            return []
    return []

def save_reflections(reflections):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w") as f:
        json.dump(reflections, f, indent=4)

# --- PWA Specific Routes ---
@app.route('/manifest.json')
def manifest():
    return send_from_directory('static', 'manifest.json')

@app.route('/sw.js')
def service_worker():
    response = make_response(send_from_directory('static/js', 'sw.js'))
    response.headers['Service-Worker-Allowed'] = '/'
    return response

# --- Page Routes ---
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/journal")
def journal():
    return render_template("journal.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/projects")
def projects():
    return render_template("projects.html")

@app.route("/resources")
def resources():
    """Serves the new Study Tracker page."""
    return render_template("resources.html")

# --- API Routes ---
@app.route("/api/reflections", methods=["GET", "POST"])
def manage_reflections():
    if request.method == "POST":
        data = request.get_json()
        new_reflection = {
            "id": int(datetime.now().timestamp() * 1000),
            "title": data.get("title", "New Entry"),
            "content": data.get("content", ""),
            "date": datetime.now().strftime("%x"),
            "time": datetime.now().strftime("%X"),
            "source": "python"
        }
        reflections = load_reflections()
        reflections.append(new_reflection)
        save_reflections(reflections)
        return jsonify(new_reflection), 201
    return jsonify(load_reflections())

@app.route("/api/reflections/<int:entry_id>", methods=["DELETE"])
def delete_reflection(entry_id):
    reflections = load_reflections()
    updated = [r for r in reflections if int(r.get('id', 0)) != entry_id]
    save_reflections(updated)
    return jsonify({"message": "Deleted"}), 200

if __name__ == "__main__":
    app.run(debug=True)
    
