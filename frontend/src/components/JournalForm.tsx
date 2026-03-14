import type { Ambience, AnalysisResult } from '../types';

type Props = {
  userId: string;
  ambience: Ambience;
  text: string;
  saving: boolean;
  analyzing: boolean;
  error: string | null;
  analyzeResult: AnalysisResult | null;
  onUserIdChange: (value: string) => void;
  onAmbienceChange: (value: Ambience) => void;
  onTextChange: (value: string) => void;
  onSave: () => void;
  onAnalyze: () => void;
};

export function JournalForm({
  userId,
  ambience,
  text,
  saving,
  analyzing,
  error,
  analyzeResult,
  onUserIdChange,
  onAmbienceChange,
  onTextChange,
  onSave,
  onAnalyze,
}: Props) {
  const characterCount = text.trim().length;

  return (
    <section className="panel-surface rounded-[1.75rem] p-6 sm:p-7">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--accent-coral)">
          New Entry
        </p>
        <h2 className="font-serif text-3xl text-(--ink-strong)">
          Write something worth returning to.
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-(--ink-soft)">
          Keep it short or let it breathe. The entry is saved with a structured
          analysis so your insights can build over time.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-(--ink-strong)">User ID</label>
          <input
            value={userId}
            onChange={(e) => onUserIdChange(e.target.value)}
            placeholder="e.g. 123"
            className="input-surface"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-(--ink-strong)">Ambience</label>
          <select
            value={ambience}
            onChange={(e) => onAmbienceChange(e.target.value as Ambience)}
            className="input-surface"
          >
            <option value="forest">Forest</option>
            <option value="ocean">Ocean</option>
            <option value="mountain">Mountain</option>
          </select>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label className="block text-sm font-medium text-(--ink-strong)">Journal Text</label>
          <span className="text-xs uppercase tracking-[0.18em] text-(--ink-soft)/80">
            {characterCount} characters
          </span>
        </div>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="How did your session feel today?"
          className="input-surface min-h-40 resize-y"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button onClick={onSave} disabled={saving} className="button-primary">
          {saving ? 'Saving entry...' : 'Save Entry'}
        </button>
        <button onClick={onAnalyze} disabled={analyzing} className="button-secondary">
          {analyzing ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {analyzeResult && (
        <div className="mt-6 rounded-3xl border border-(--line-soft) bg-[rgba(245,240,234,0.78)] p-5 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-serif text-xl text-(--ink-strong)">Analysis Preview</h3>
            <span className="rounded-full bg-(--accent-mist) px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-(--accent-deep)">
              {analyzeResult.emotion}
            </span>
          </div>

          <p className="mt-4 leading-6 text-(--ink-soft)">{analyzeResult.summary}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {analyzeResult.keywords.length ? (
              analyzeResult.keywords.map((keyword) => (
                <span key={keyword} className="soft-chip">
                  {keyword}
                </span>
              ))
            ) : (
              <span className="text-sm text-(--ink-soft)">No keywords detected.</span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
