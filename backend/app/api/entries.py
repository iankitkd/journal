from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import JournalAnalysis, JournalEntry
from app.db.session import get_db
from app.schemas.journal import AnalysisResponse, JournalCreate, JournalEntryResponse
from app.services.analysis import analyze_text


router = APIRouter(prefix="/api/journal", tags=["journal"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_journal_entry(
    payload: JournalCreate,
    db: Session = Depends(get_db),
) -> JournalEntryResponse:
    entry = JournalEntry(
        user_id=payload.userId,
        ambience=payload.ambience,
        text=payload.text,
    )
    analysis_result = analyze_text(payload.text)
    analysis = JournalAnalysis(
        entry=entry,
        emotion=analysis_result.emotion,
        keywords=analysis_result.keywords,
        summary=analysis_result.summary,
    )

    db.add(entry)
    db.add(analysis)
    db.commit()
    db.refresh(entry)

    return JournalEntryResponse(
        id=entry.id,
        userId=entry.user_id,
        ambience=entry.ambience,
        text=entry.text,
        createdAt=entry.created_at,
        analysis=AnalysisResponse(
            emotion=analysis.emotion,
            keywords=analysis.keywords or [],
            summary=analysis.summary,
        ),
    )


@router.get("/{user_id}")
def get_entries(
    user_id: str,
    db: Session = Depends(get_db),
) -> List[JournalEntryResponse]:
    stmt = (
        select(JournalEntry)
        .where(JournalEntry.user_id == user_id)
        .order_by(JournalEntry.created_at.desc())
    )
    entries = db.execute(stmt).scalars().all()

    results: List[JournalEntryResponse] = []
    for entry in entries:
        analysis = None
        if entry.analysis:
            analysis = AnalysisResponse(
                emotion=entry.analysis.emotion,
                keywords=entry.analysis.keywords or [],
                summary=entry.analysis.summary,
            )

        results.append(
            JournalEntryResponse(
                id=entry.id,
                userId=entry.user_id,
                ambience=entry.ambience,
                text=entry.text,
                createdAt=entry.created_at,
                analysis=analysis,
            )
        )

    return results

