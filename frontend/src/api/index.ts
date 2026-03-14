import type { AnalysisResult, Insights, JournalEntry } from '../types';

const API_BASE = 'http://localhost:8000';

const apiUrl = (path: string) => `${API_BASE}${path}`;

export async function getEntries(userId: string): Promise<JournalEntry[]> {
  if (!userId.trim()) {
    return [];
  }

  const res = await fetch(apiUrl(`/api/journal/${encodeURIComponent(userId)}`));
  if (!res.ok) {
    throw new Error('Failed to load entries');
  }
  return res.json();
}

export async function getInsights(userId: string): Promise<Insights> {
  if (!userId.trim()) {
    return {
      totalEntries: 0,
      topEmotion: '',
      mostUsedAmbience: '',
      recentKeywords: [],
    };
  }

  const res = await fetch(apiUrl(`/api/journal/insights/${encodeURIComponent(userId)}`));
  if (!res.ok) {
    throw new Error('Failed to load insights');
  }
  return res.json();
}

export async function createEntry(payload: {
  userId: string;
  ambience: string;
  text: string;
}): Promise<void> {
  const res = await fetch(apiUrl('/api/journal'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to save entry');
  }
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  const res = await fetch(apiUrl('/api/journal/analyze'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error('Failed to analyze text');
  }
  return res.json();
}