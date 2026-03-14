from collections import Counter
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.models import JournalAnalysis, JournalEntry
from app.db.session import get_db
from app.schemas.journal import InsightsResponse


router = APIRouter(prefix="/api/journal", tags=["insights"])


@router.get("/insights/{user_id}")
def get_insights(
    user_id: str,
    db: Session = Depends(get_db),
) -> InsightsResponse:
    # Total entries
    total_entries = db.execute(
        select(func.count()).select_from(
            select(JournalEntry.id).where(JournalEntry.user_id == user_id).subquery()
        )
    ).scalar_one()

    # Most used ambience
    ambience_rows = db.execute(
        select(JournalEntry.ambience, func.count())
        .where(JournalEntry.user_id == user_id)
        .group_by(JournalEntry.ambience)
    ).all()
    most_used_ambience = ""
    if ambience_rows:
        most_used_ambience = max(ambience_rows, key=lambda r: r[1])[0]

    # Emotions and recent keywords (from analysis)
    analysis_rows = db.execute(
        select(JournalAnalysis.emotion, JournalAnalysis.keywords)
        .join(JournalEntry, JournalAnalysis.entry_id == JournalEntry.id)
        .where(JournalEntry.user_id == user_id)
        .order_by(JournalAnalysis.created_at.desc())
    ).all()

    emotions = [row[0] for row in analysis_rows if row[0]]
    top_emotion = ""
    if emotions:
        top_emotion = Counter(emotions).most_common(1)[0][0]

    recent_keywords: List[str] = []
    for _, kw_list in analysis_rows[:10]:
        if kw_list:
            recent_keywords.extend(kw_list)
    # Deduplicate while preserving order
    seen: set[str] = set()
    unique_keywords: List[str] = []
    for kw in recent_keywords:
        if kw not in seen:
            seen.add(kw)
            unique_keywords.append(kw)

    return InsightsResponse(
        totalEntries=total_entries,
        topEmotion=top_emotion or "unknown",
        mostUsedAmbience=most_used_ambience or "",
        recentKeywords=unique_keywords[:10],
    )

