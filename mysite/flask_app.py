from flask import Flask, request, jsonify, render_template, send_from_directory, make_response
import json, os
from datetime import datetime

# Creates the Flask application object.
app = Flask(__name__)

# --- Configuration ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "static", "backend", "reflections.json")

# --- Helper Functions for JSON Management ---
def load_reflections():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r") as f:
                return json.load(f)
        except json.JSONDecodeError:
            print("Warning: JSON file is empty or invalid. Starting with empty list.")
            return []
    return []

def save_reflections(reflections):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w") as f:
        json.dump(reflections, f, indent=4)

# ==========================================
#  LAB 7 PWA ROUTES (NEW ADDITIONS)
# ==========================================

# 1. Serve Manifest (Makes the app installable)
@app.route('/manifest.json')
def manifest():
    return send_from_directory('static', 'manifest.json')

# 2. Serve Service Worker (Enables Offline Mode)
@app.route('/sw.js')
def service_worker():
    # We serve the file from static/js/ but at the root URL /sw.js
    response = make_response(send_from_directory('static/js', 'sw.js'))
    # Critical Header: Allows the SW to control the whole app, not just /static/js/
    response.headers['Service-Worker-Allowed'] = '/'
    return response

# ==========================================
#  STANDARD PAGE ROUTES
# ==========================================

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

# ==========================================
#  API ROUTES
# ==========================================

@app.route("/api/reflections", methods=["GET"])
def get_reflections():
    reflections = load_reflections()
    return jsonify(reflections)

@app.route("/api/reflections", methods=["POST"])
def add_reflection():
    try:
        data = request.get_json()
        new_id = int(datetime.now().timestamp() * 1000)

        # Mate's specific data structure
        new_reflection = {
            "id": new_id,
            "title": data.get("title", "New API Entry"),
            "content": data.get("content", ""), # Safe get to prevent crash if missing
            "date": datetime.now().strftime("%x"),
            "time": datetime.now().strftime("%X"),
            "source": "python"
        }

        reflections = load_reflections()
        reflections.append(new_reflection)
        save_reflections(reflections)

        return jsonify(new_reflection), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

if __name__ == "__main__":
    app.run(debug=True)
