import json
import requests
from google.auth.transport.requests import Request
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from google import genai
from load_creds import load_creds

creds = load_creds()
with open("client_secret.json", "r") as f:
    project_id = json.load(f)["installed"]["project_id"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def home():
    return {"status": "BIS Backend Running"}
@app.post("/chat")
def chat(data: ChatRequest):
    try:
        if not creds.valid:
            creds.refresh(Request())

        url = (
            "https://generativelanguage.googleapis.com/v1beta/"
            "models/gemini-3.5-flash-lite:generateContent"
        )

        headers = {
            "Authorization": f"Bearer {creds.token}",
            "Content-Type": "application/json",
            "x-goog-user-project": project_id
        }

        body = {
            "contents": [
                {
                    "parts": [
                        {"text": data.message}
                    ]
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
        return {"error": str(e)
        }
        
       

    except Exception as e:
        return {
            "error": str(e)
        }

class SearchRequest(BaseModel):
    query: str

@app.post("/search")
def search_standards(data: SearchRequest):
    sample_standards = [
        {
            "code": "IS 456",
            "title": "Plain and Reinforced Concrete",
            "description": "Code of practice for structural concrete."
        },
        {
            "code": "IS 800",
            "title": "General Construction in Steel",
            "description": "Code of practice for steel structures."
        },
        {
            "code": "IS 1893",
            "title": "Earthquake Resistant Design",
            "description": "Criteria for earthquake resistant design of structures."
        },
        {
            "code": "IS 875",
            "title": "Design Loads",
            "description": "Design loads for buildings and structures."
        }
    ]

    query = data.query.lower()

    results = [
        standard
        for standard in sample_standards
        if query in standard["code"].lower()
        or query in standard["title"].lower()
        or query in standard["description"].lower()
    ]

    return {
        "results": results
    }
