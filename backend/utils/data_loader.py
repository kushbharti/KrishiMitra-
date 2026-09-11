import json
import os
from fastapi import HTTPException


DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")


def load_json(filename: str):
    """Load a JSON file from the /data/ directory."""
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(
            status_code=500,
            detail=f"Data file '{filename}' not found. Please ensure the data directory is properly set up."
        )
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse data file '{filename}': {str(e)}"
        )


def save_json(filename: str, data) -> None:
    """Save data to a JSON file in the /data/ directory."""
    filepath = os.path.join(DATA_DIR, filename)
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to write data file '{filename}': {str(e)}"
        )
