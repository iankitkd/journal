from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class JournalCreate(BaseModel):
    userId: str = Field(..., min_length=1)
    ambience: str = Field(..., min_length=1)
    text: str = Field(..., min_length=1)


class JournalEntryResponse(BaseModel):
    id: UUID
    userId: str
    ambience: str
    text: str
    createdAt: datetime
    analysis: Optional[AnalysisResponse] = None


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1)


class AnalysisResponse(BaseModel):
    emotion: str
    keywords: List[str]
    summary: str


class InsightsResponse(BaseModel):
    totalEntries: int
    topEmotion: str
    mostUsedAmbience: str
    recentKeywords: List[str]

