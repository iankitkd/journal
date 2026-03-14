from fastapi import APIRouter

from app.api.analysis import router as analysis_router
from app.api.entries import router as entries_router
from app.api.insights import router as insights_router

api_router = APIRouter()

api_router.include_router(entries_router)
api_router.include_router(analysis_router)
api_router.include_router(insights_router)

