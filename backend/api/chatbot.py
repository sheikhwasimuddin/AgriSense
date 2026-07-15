import httpx
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from core.security import get_current_active_user
from db import models

router = APIRouter()

GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"  # placeholder
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

SYSTEM_PROMPT = """You are AgriBot, an expert AI agricultural advisor built into the AgriSense farming platform. You help farmers with:
- Crop selection and rotation strategies
- Pest and disease identification and treatment
- Optimal planting and harvesting times
- Soil health and fertilizer recommendations
- Weather interpretation for farming decisions
- Irrigation and water management
- Market trends and pricing advice

Keep responses concise, practical, and friendly. Use bullet points when listing multiple items. If you don't know something specific, recommend consulting a local agricultural extension officer."""

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/ask", response_model=ChatResponse)
async def ask_chatbot(
    req: ChatRequest,
    current_user: models.User = Depends(get_current_active_user)
):
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                GEMINI_URL,
                json={
                    "contents": [{
                        "parts": [
                            {"text": SYSTEM_PROMPT},
                            {"text": req.message}
                        ]
                    }]
                }
            )
            
            if resp.status_code == 200:
                data = resp.json()
                reply = data["candidates"][0]["content"]["parts"][0]["text"]
                return ChatResponse(reply=reply)
            else:
                return ChatResponse(reply="I'm having trouble connecting right now. Please try again in a moment.")
    except Exception:
        return ChatResponse(reply="Sorry, I encountered an error. Please try again later.")
