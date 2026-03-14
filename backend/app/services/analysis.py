import json

from fastapi import HTTPException
from groq import Groq

from app.config import get_settings
from app.schemas.journal import AnalysisResponse


settings = get_settings()
groq_client = Groq(api_key=settings.groq_api_key)


def analyze_text(payload_text: str) -> AnalysisResponse:
    messages = [
        {
            "role": "system",
            "content": "Extract journal entry information and analyze user emotions.",
        },
        {"role": "user", "content": payload_text},
    ]

    response_format = {
        "type": "json_schema",
        "json_schema": {
            "name": "journal_analysis",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "emotion": {
                        "type": "string",
                        "enum": ["calm", "anxious", "neutral"],
                    },
                    "keywords": {
                        "type": "array",
                        "items": {"type": "string"},
                    },
                    "summary": {"type": "string"},
                },
                "required": ["emotion", "keywords", "summary"],
                "additionalProperties": False,
            },
        },
    }

    try:
        response = groq_client.chat.completions.create(
            model=settings.llm_model,
            messages=messages,
            response_format=response_format,
        )
        result = json.loads(response.choices[0].message.content or "{}")
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Groq SDK request failed: {exc}") from exc

    return AnalysisResponse(
        emotion=result.get("emotion", "neutral"),
        keywords=result.get("keywords", []),
        summary=result.get("summary", payload_text[:200]),
    )
