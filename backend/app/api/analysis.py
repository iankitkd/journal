from fastapi import APIRouter

from app.schemas.journal import AnalysisResponse, AnalyzeRequest
from app.services.analysis import analyze_text

router = APIRouter(prefix="/api/journal", tags=["analysis"])

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_journal_text(payload: AnalyzeRequest) -> AnalysisResponse:
    return analyze_text(payload.text)
