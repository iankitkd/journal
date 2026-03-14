import uuid

from sqlalchemy import Column, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from .base import Base


class JournalEntry(Base):
  __tablename__ = "journal_entries"

  id = Column(
      UUID(as_uuid=True),
      primary_key=True,
      default=uuid.uuid4,
  )
  user_id = Column(String, nullable=False, index=True)
  ambience = Column(String, nullable=False, index=True)
  text = Column(Text, nullable=False)
  created_at = Column(
      DateTime(timezone=True),
      server_default=func.now(),
      nullable=False,
  )

  analysis = relationship(
      "JournalAnalysis",
      back_populates="entry",
      uselist=False,
      cascade="all, delete-orphan",
  )


class JournalAnalysis(Base):
  __tablename__ = "journal_analysis"

  id = Column(
      UUID(as_uuid=True),
      primary_key=True,
      default=uuid.uuid4,
  )
  entry_id = Column(
      UUID(as_uuid=True),
      ForeignKey("journal_entries.id", ondelete="CASCADE"),
      unique=True,
      nullable=False,
  )
  emotion = Column(String, nullable=False, index=True)
  keywords = Column(JSONB, nullable=False, server_default="[]")
  summary = Column(Text, nullable=False)
  created_at = Column(
      DateTime(timezone=True),
      server_default=func.now(),
      nullable=False,
  )

  entry = relationship("JournalEntry", back_populates="analysis")

