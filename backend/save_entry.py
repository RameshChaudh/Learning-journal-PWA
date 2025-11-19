import json
from datetime import datetime

JSON_FILE = 'reflections.json'

def main():
    print("\n=== Learning Journal - Add Entry via Python ===")
    print("This will save an entry to reflections.json\n")
    
    # Get input matching your web form
    title = input("Enter entry title: ")
    content = input("Enter entry content: ")
    
    # Create entry matching your JavaScript structure
    new_entry = {
        "id": int(datetime.now().timestamp() * 1000),  # Match JS Date.now()
        "title": title,
        "content": content,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "time": datetime.now().strftime("%H:%M:%S"),
        "source": "python"  # Add source identifier
    }
    
    # Load existing entries from JSON file
    try:
        with open(JSON_FILE, 'r', encoding='utf-8') as file:
            entries = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        entries = []
    
    # Add new entry to beginning (matching your unshift behavior)
    entries.insert(0, new_entry)
    
    # Save back to JSON file
    with open(JSON_FILE, 'w', encoding='utf-8') as file:
        json.dump(entries, file, indent=2)
    
    print(f"\n Entry '{title}' saved to {JSON_FILE}!")
    print(f"Total entries: {len(entries)}")

if __name__ == "__main__":
    main()