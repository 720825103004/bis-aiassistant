from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend (React) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "BIS AI Backend Running"}

@app.post("/chat")
def chat(data: dict):
    user_message = data.get("message")

    # Dummy response
    reply = f"BIS AI says: You asked '{user_message}'"

    return {"response": reply}