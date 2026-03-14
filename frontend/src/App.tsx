import { useEffect, useState } from 'react';
import { analyzeText, createEntry, getEntries, getInsights } from './api';
import type { Ambience, AnalysisResult, Insights, JournalEntry } from './types';
import { EntriesList, InsightsPanel, JournalForm } from './components';
import './App.css';

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function App() {
  const [userId, setUserId] = useState('123');
  const [ambience, setAmbience] = useState<Ambience>('forest');
  const [text, setText] = useState('');

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);

  const [loadingEntries, setLoadingEntries] = useState(false);
  const [savingEntry, setSavingEntry] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const [analyzeResult, setAnalyzeResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchEntries(currentUserId: string) {
    if (!currentUserId.trim()) {
      setEntries([]);
      return;
    }

    try {
      setLoadingEntries(true);
      const data = await getEntries(currentUserId);
      setEntries(data);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Error loading entries'));
    } finally {
      setLoadingEntries(false);
    }
  }

  async function fetchInsights(currentUserId: string) {
    if (!currentUserId.trim()) {
      setInsights(null);
      return;
    }

    try {
      setLoadingInsights(true);
      const data = await getInsights(currentUserId);
      setInsights(data);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Error loading insights'));
    } finally {
      setLoadingInsights(false);
    }
  }

  async function handleSaveEntry() {
    if (!userId.trim() || !text.trim()) {
      setError('User ID and journal text are required.');
      return;
    }

    try {
      setSavingEntry(true);
      setError(null);
      await createEntry({ userId, ambience, text });
      setText('');
      setAnalyzeResult(null);
      await fetchEntries(userId);
      await fetchInsights(userId);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Error saving entry'));
    } finally {
      setSavingEntry(false);
    }
  }

  async function handleAnalyze() {
    if (!text.trim()) {
      setError('Enter some journal text to analyze.');
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);
      const data = await analyzeText(text);
      setAnalyzeResult(data);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Error analyzing text'));
    } finally {
      setAnalyzing(false);
    }
  }

  useEffect(() => {
    setError(null);

    if (userId.trim()) {
      void fetchEntries(userId);
      void fetchInsights(userId);
    } else {
      setEntries([]);
      setInsights(null);
    }
  }, [userId]);

  return (
    <div className="app-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="hero-panel overflow-hidden rounded-4xl px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-(--accent-deep)/70">
                Reflective Journaling
              </p>
              <h1 className="mt-3 font-serif text-4xl leading-tight text-(--ink-strong) sm:text-5xl">
                A calmer journal, with insight that feels useful.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-(--ink-soft) sm:text-base">
                Capture a session, keep the tone grounded, and let the app surface
                patterns in mood, ambience, and recurring themes over time.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:w-100">
              <div className="stat-pill">
                <span className="stat-label">Entries</span>
                <span className="stat-value">{entries.length}</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Top Mood</span>
                <span className="stat-value">{insights?.topEmotion || 'None'}</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Ambience</span>
                <span className="stat-value">{ambience}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <JournalForm
            userId={userId}
            ambience={ambience}
            text={text}
            saving={savingEntry}
            analyzing={analyzing}
            error={error}
            analyzeResult={analyzeResult}
            onUserIdChange={setUserId}
            onAmbienceChange={setAmbience}
            onTextChange={setText}
            onSave={handleSaveEntry}
            onAnalyze={handleAnalyze}
          />

          <InsightsPanel
            insights={insights}
            loading={loadingInsights}
            onRefresh={() => void fetchInsights(userId)}
          />
        </div>

        <EntriesList
          entries={entries}
          loading={loadingEntries}
          onRefresh={() => void fetchEntries(userId)}
        />
      </main>
    </div>
  );
}

export default App;
