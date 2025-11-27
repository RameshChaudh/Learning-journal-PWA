from flask import Flask, request, jsonify, render_template
import json, os
from datetime import datetime

# Creates the Flask application object.
app = Flask(__name__)

# --- Configuration ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "static", "backend", "reflections.json")

# --- Helper Functions for JSON Management (Omitted for brevity) ---
def load_reflections():
    # ... (unchanged)
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r") as f:
                return json.load(f)
        except json.JSONDecodeError:
            print("Warning: JSON file is empty or invalid. Starting with empty list.")
            return []
    return []

def save_reflections(reflections):
    # ... (unchanged)
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w") as f:
        json.dump(reflections, f, indent=4)

# --- Flask Routes (The API and Pages) ---

# Route 1: Serves the Home Page (index.html)
# The function name 'index' is the target for url_for('index')
@app.route("/")
def index():
    return render_template("index.html")

# NEW ROUTE: Serves the Journal Page (journal.html)
# The function name 'journal' is the target for url_for('journal')
@app.route("/journal")
def journal():
    return render_template("journal.html")

# NEW ROUTE: Serves the About Page (about.html)
# The function name 'about' is the target for url_for('about')
@app.route("/about")
def about():
    return render_template("about.html")

# NEW ROUTE: Serves the Projects Page (projects.html)
# The function name 'projects' is the target for url_for('projects')
@app.route("/projects")
def projects():
    return render_template("projects.html")


@app.route("/api/reflections", methods=["GET"])
def get_reflections():
    reflections = load_reflections()
    return jsonify(reflections)

@app.route("/api/reflections", methods=["POST"])
def add_reflection():
    data = request.get_json()
    new_id = int(datetime.now().timestamp() * 1000)

    new_reflection = {
        "id": new_id,
        "title": data.get("title", "New API Entry"),
        "content": data["content"],
        "date": datetime.now().strftime("%x"),
        "time": datetime.now().strftime("%X"),
        "source": "python"
    }

    reflections = load_reflections()
    reflections.append(new_reflection)
    save_reflections(reflections)

    return jsonify(new_reflection), 201

# Route 4: DELETE API Route
@app.route("/api/reflections/<int:entry_id>", methods=["DELETE"])
def delete_reflection(entry_id):
    reflections = load_reflections()
    original_length = len(reflections)
    updated_reflections = [r for r in reflections if int(r.get('id', 0)) != entry_id]

    if len(updated_reflections) < original_length:
        save_reflections(updated_reflections)
        return jsonify({"message": f"Reflection ID {entry_id} deleted."}), 200
    else:
        return jsonify({"message": f"Reflection ID {entry_id} not found."}), 404
