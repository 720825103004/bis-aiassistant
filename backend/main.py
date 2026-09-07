import json
import requests
import os
import tempfile

from google.auth.transport.requests import Request
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader


from load_creds import load_creds


# Load OAuth credentials
creds = load_creds()

# Get Google Cloud project ID
with open("client_secret.json", "r") as f:
    project_id = json.load(f)["installed"]["project_id"]


app = FastAPI()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# CHAT
# -------------------------

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
            "x-goog-user-project": project_id,
        }

        body = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": data.message
                        }
                    ]
                }
            ]
        }

        r = requests.post(
            url,
            headers=headers,
            json=body,
            timeout=60
        )

        result = r.json()

        if r.status_code != 200:
            return {
                "error": result
            }

        text = result["candidates"][0]["content"]["parts"][0]["text"]

        return {
            "response": text
        }

    except Exception as e:
        return {
            "error": str(e)
        }


# -------------------------
# SEARCH STANDARDS
# -------------------------

class SearchRequest(BaseModel):
    query: str


@app.post("/search")
def search_standards(data: SearchRequest):

    sample_standards = [
        {
            "code": "IS 456",
            "title": "Plain and Reinforced Concrete",
            "description": "Code of practice for structural concrete.",
        },
        {
            "code": "IS 800",
            "title": "General Construction in Steel",
            "description": "Code of practice for steel structures.",
        },
        {
            "code": "IS 1893",
            "title": "Earthquake Resistant Design",
            "description": "Criteria for earthquake resistant design of structures.",
        },
        {
            "code": "IS 875",
            "title": "Design Loads",
            "description": "Design loads for buildings and structures.",
        },
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

@app.post("/analyze-document")
async def analyze_document(file: UploadFile = File(...)):
    try:
        if not file.filename.lower().endswith(".pdf"):
            return {
                "error": "Please upload a PDF file only."
            }

        contents = await file.read()

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as temp:
            temp.write(contents)
            temp_path = temp.name

        reader = PdfReader(temp_path)

        extracted_text = ""

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                extracted_text += page_text + "\n"

        os.remove(temp_path)

        if not extracted_text.strip():
            return {
                "error": "No readable text found in the PDF."
            }

        if not creds.valid:
            creds.refresh(Request())

        url = (
            "https://generativelanguage.googleapis.com/v1beta/"
            "models/gemini-3.5-flash-lite:generateContent"
        )

        headers = {
            "Authorization": f"Bearer {creds.token}",
            "Content-Type": "application/json",
            "x-goog-user-project": project_id,
        }

        prompt = f"""
You are a BIS standards compliance assistant.

Analyze the following document text.

Give:
1. Short summary
2. BIS standards mentioned
3. Important compliance points
4. Possible issues or risks
5. Recommendations

Document:
{extracted_text[:12000]}
"""

        body = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        }

        r = requests.post(
            url,
            headers=headers,
            json=body,
            timeout=60
        )

        result = r.json()

        if r.status_code != 200:
            return {
                "error": result
            }

        analysis = result["candidates"][0]["content"]["parts"][0]["text"]

        return {
            "filename": file.filename,
            "message": "Document analyzed successfully",
            "analysis": analysis
        }

    except Exception as e:
        return {
            "error": str(e)
        }

@app.post("/compare")
def compare_standards(data: dict):
    try:
        standard1 = data.get("standard1", "")
        standard2 = data.get("standard2", "")

        if not creds.valid:
            creds.refresh(Request())

        url = (
            "https://generativelanguage.googleapis.com/v1beta/"
            "models/gemini-3.5-flash-lite:generateContent"
        )

        headers = {
            "Authorization": f"Bearer {creds.token}",
            "Content-Type": "application/json",
            "x-goog-user-project": project_id,
        }

        prompt = f"""
You are a BIS standards compliance assistant.

Compare these two BIS standards:

Standard 1: {standard1}
Standard 2: {standard2}

Give the result in this format:

1. Purpose
2. Scope
3. Main material or application
4. Important compliance points
5. Key differences
6. Similarities
7. When each standard should be used

Keep the answer clear and concise.
"""

        body = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        }

        r = requests.post(
            url,
            headers=headers,
            json=body,
            timeout=60
        )

        result = r.json()

        if r.status_code != 200:
            return {
                "error": result
            }

        comparison = result["candidates"][0]["content"]["parts"][0]["text"]

        return {
            "standard1": standard1,
            "standard2": standard2,
            "comparison": comparison
        }

    except Exception as e:
        return {
            "error": str(e)
        }