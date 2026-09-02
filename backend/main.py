from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
from google.auth.transport.requests import Request
from load_creds import load_creds

# Load credentials
creds = load_creds()

with open("client_secret.json", "r") as f:
    project_id = json.load(f)["installed"]["project_id"]

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class ChatRequest(BaseModel):
    message: str

# Home route
@app.get("/")
def home():
    return {"status": "BIS Backend Running"}

# Chat route (Gemini AI)
@app.post("/chat")
def chat(data: ChatRequest):
    try:
        if not creds.valid:
            creds.refresh(Request())

        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

        headers = {
            "Authorization": f"Bearer {creds.token}",
            "Content-Type": "application/json",
            "x-goog-user-project": project_id
        }

        body = {
            "contents": [
                {
                    "parts": [{"text": data.message}]
                }
            ]
        }

        r = requests.post(url, headers=headers, json=body)
        result = r.json()

        if r.status_code != 200:
            return {"error": result}

        text = result["candidates"][0]["content"]["parts"][0]["text"]

        return {"response": text}

    except Exception as e:
        return {"error": str(e)}


# Search API
class SearchRequest(BaseModel):
    query: str

@app.post("/search")
def search(data: SearchRequest):
    sample_standards = [
        {"code": "IS 456", "title": "Plain and Reinforced Concrete", "description": "Concrete structures"},
        {"code": "IS 800", "title": "General Construction in Steel", "description": "Steel structures"},
        {"code": "IS 1893", "title": "Earthquake Resistant Design", "description": "Seismic design"},
        {"code": "IS 875", "title": "Design Loads", "description": "Loads for buildings"}
    ]

    query = data.query.lower()

    results = [
        std for std in sample_standards
        if query in std["code"].lower()
        or query in std["title"].lower()
        or query in std["description"].lower()
    ]

    return {"results": results}
