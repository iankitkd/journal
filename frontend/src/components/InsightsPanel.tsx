import type { Insights } from '../types';

type Props = {
  insights: Insights | null;
  loading: boolean;
  onRefresh: () => void;
};

export function InsightsPanel({ insights, loading, onRefresh }: Props) {
  return (
    <section className="panel-surface rounded-[1.75rem] p-6 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--accent-coral)">
            Overview
          </p>
          <h2 className="mt-2 font-serif text-3xl text-(--ink-strong)">Insights</h2>
        </div>
        <button onClick={onRefresh} disabled={loading} className="button-ghost">
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {!insights && (
        <div className="rounded-3xl border border-dashed border-(--line-soft) bg-white/40 px-5 py-8 text-sm leading-6 text-(--ink-soft)">
          No insights yet. Once you have analyzed entries, your emotional trends will appear here.
        </div>
      )}

      {insights && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="insight-card sm:col-span-2">
            <p className="insight-label">Total Entries</p>
            <p className="mt-3 font-serif text-5xl text-(--ink-strong)">
              {insights.totalEntries}
            </p>
          </div>

          <div className="insight-card">
            <p className="insight-label">Top Emotion</p>
            <p className="mt-3 text-lg font-semibold capitalize text-(--accent-deep)">
              {insights.topEmotion || '-'}
            </p>
          </div>

          <div className="insight-card">
            <p className="insight-label">Most Used Ambience</p>
            <p className="mt-3 text-lg font-semibold capitalize text-(--ink-strong)">
              {insights.mostUsedAmbience || '-'}
            </p>
          </div>

          <div className="insight-card sm:col-span-2">
            <p className="insight-label">Recent Keywords</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {insights.recentKeywords.length ? (
                insights.recentKeywords.map((keyword) => (
                  <span key={keyword} className="soft-chip">
                    {keyword}
                  </span>
                ))
              ) : (
                <span className="text-sm text-(--ink-soft)">None</span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
