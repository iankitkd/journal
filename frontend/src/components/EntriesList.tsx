import type { JournalEntry } from '../types';

type Props = {
  entries: JournalEntry[];
  loading: boolean;
  onRefresh: () => void;
};

export function EntriesList({ entries, loading, onRefresh }: Props) {
  return (
    <section className="panel-surface rounded-[1.75rem] p-6 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--accent-coral)">
            Archive
          </p>
          <h2 className="mt-2 font-serif text-3xl text-(--ink-strong)">Previous Entries</h2>
        </div>
        <button onClick={onRefresh} disabled={loading} className="button-ghost">
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {entries.length === 0 && (
        <div className="rounded-3xl border border-dashed border-(--line-soft) bg-white/40 px-5 py-8 text-sm text-(--ink-soft)">
          No entries yet. Start by writing a journal entry.
        </div>
      )}

      <ul className="space-y-4">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="rounded-3xl border border-(--line-soft) bg-[rgba(255,252,247,0.82)] p-5 text-sm shadow-[0_12px_32px_rgba(110,82,60,0.08)]"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-(--ink-soft)/80">
              <span className="soft-chip uppercase tracking-[0.2em]">{entry.ambience}</span>
              <span>{new Date(entry.createdAt).toLocaleString()}</span>
            </div>

            <p className="whitespace-pre-line text-[15px] leading-7 text-(--ink-strong)">
              {entry.text}
            </p>

            {entry.analysis && (
              <div className="mt-4 rounded-[1.25rem] bg-(--accent-mist)/75 p-4 text-sm text-(--ink-soft)">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-(--accent-deep)">
                    Insight
                  </span>
                  <span className="font-semibold text-(--accent-deep)">
                    {entry.analysis.emotion}
                  </span>
                </div>

                <p className="mt-3 leading-6">{entry.analysis.summary}</p>

                {!!entry.analysis.keywords.length && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.analysis.keywords.map((keyword) => (
                      <span key={keyword} className="soft-chip">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
