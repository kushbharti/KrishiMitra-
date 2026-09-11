import os
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

SYSTEM_PROMPT = """You are KrishiMitra AI, a dedicated farming assistant for Indian farmers.
You specialize in crop diseases, farming practices, crop selection, government agricultural schemes, 
income planning, and weather-related crop risks.

CRITICAL RULES:
1. Speak plainly and simply. Use simple terms.
2. If asked about something unrelated to agriculture or farming, politely decline and say you only help with farming.
3. Keep answers concise but actionable. Use bullet points where appropriate.
4. If the user mentions a specific Indian state or season, tailor your advice to that context.
5. If you do not know the answer, admit it. Do not guess.
"""

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[Message] = []

class ChatResponse(BaseModel):
    reply: str
    model: str = "grok-beta"

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest) -> ChatResponse:
    """Send a message to the KrishiMitra AI assistant and get a response."""
    api_key = os.getenv("GROK_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500, 
            detail="KrishiMitra AI is not configured. Please set the GROK_API_KEY environment variable."
        )

    # Format history for Grok (OpenAI compatible)
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    for msg in request.history:
        messages.append({
            "role": msg.role,
            "content": msg.content
        })
    
    # Add the current message
    messages.append({
        "role": "user",
        "content": request.message
    })

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.x.ai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "grok-beta",
                    "messages": messages,
                    "temperature": 0.3,
                }
            )
            response.raise_for_status()
            data = response.json()
            reply_text = data["choices"][0]["message"]["content"]
            
        return ChatResponse(reply=reply_text, model="grok-beta")
    except httpx.HTTPStatusError as e:
        print(f"Grok API Error: {e.response.text}")
        raise HTTPException(status_code=500, detail="Failed to communicate with Grok AI.")
    except Exception as e:
        print(f"Unexpected AI Error: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred while processing your request.")
