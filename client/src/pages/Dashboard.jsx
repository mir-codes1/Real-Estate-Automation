import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import StatusBadge from '../components/StatusBadge';
import { LoadingState, ErrorState } from '../components/LoadingSpinner';

// ─── helpers ────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// ─── icons ───────────────────────────────────────────────────────────────────

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function BuildingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function TerminalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

// ─── panel primitives ────────────────────────────────────────────────────────

const SURFACE_STYLE = {
  background: 'linear-gradient(180deg, rgba(249,249,249,0.96) 0%, rgba(249,249,249,0.78) 100%)',
  border: '1px solid rgba(90,169,230,0.22)',
  boxShadow:
    '0 30px 60px -38px rgba(90,169,230,0.45), 0 10px 25px -18px rgba(255,99,146,0.2), inset 0 1px 0 rgba(255,255,255,0.9)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
};

// ─── panel + row primitives ─────────────────────────────────────────────────

function PanelCard({ eyebrow, title, count, to, delayClass, children }) {
  return (
    <div className={`rise ${delayClass} rounded-[16px]`} style={SURFACE_STYLE}>
      <div
        className="flex items-center justify-between"
        style={{ paddingLeft: '28px', paddingRight: '28px', paddingTop: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(90,169,230,0.18)' }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-[9px] font-semibold uppercase tracking-[0.26em]"
            style={{ color: 'rgba(90,169,230,0.65)' }}
          >
            {eyebrow}
          </span>
          <h3 className="font-serif-display text-[34px] leading-none" style={{ color: '#5aa9e6' }}>
            {title}
            <span style={{ color: '#ff6392' }}>.</span>
          </h3>
          <span
            className="text-[11px] font-semibold rounded-full tabular"
            style={{
              color: '#5aa9e6',
              background: 'rgba(127,200,248,0.22)',
              border: '1px solid rgba(90,169,230,0.3)',
              padding: '1px 4px',
            }}
          >
            {count}
          </span>
        </div>
        <Link
          to={to}
          className="text-[11px] font-semibold uppercase tracking-[0.18em] no-underline transition-colors"
          style={{ color: '#ff6392' }}
        >
          View all →
        </Link>
      </div>
      <div style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '16px', paddingBottom: '16px' }}>{children}</div>
    </div>
  );
}

function Row({ barColor, isLast, children }) {
  return (
    <div
      className="relative group rounded-[16px] transition-all duration-200"
      style={{
        borderBottom: isLast ? 'none' : '1px solid rgba(90,169,230,0.12)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background =
          'linear-gradient(90deg, rgba(127,200,248,0.14), rgba(255,99,146,0.06))';
        e.currentTarget.style.borderBottomColor = 'transparent';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderBottomColor = isLast ? 'transparent' : 'rgba(90,169,230,0.12)';
      }}
    >
      <span
        className="absolute left-2 top-6 bottom-6 w-[3px] rounded-full transition-all duration-300 group-hover:top-3 group-hover:bottom-3"
        style={{ background: barColor, boxShadow: `0 0 14px ${barColor}` }}
      />
      <div className="flex items-start justify-between" style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '20px', gap: '24px' }}>
        {children}
      </div>
    </div>
  );
}

function EmptyRow({ text }) {
  return (
    <p className="px-5 py-10 text-[13px]" style={{ color: 'rgba(90,169,230,0.6)' }}>
      {text}
    </p>
  );
}

// ─── stat card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, accent, hint }) {
  const tone =
    accent === 'rose'
      ? { glow: 'rgba(255,99,146,0.55)', chipFrom: 'rgba(255,99,146,0.22)', chipTo: 'rgba(255,228,94,0.2)', fg: '#ff6392' }
      : accent === 'sun'
      ? { glow: 'rgba(255,228,94,0.6)', chipFrom: 'rgba(255,228,94,0.28)', chipTo: 'rgba(127,200,248,0.2)', fg: '#5aa9e6' }
      : { glow: 'rgba(127,200,248,0.6)', chipFrom: 'rgba(127,200,248,0.28)', chipTo: 'rgba(255,99,146,0.16)', fg: '#5aa9e6' };

  return (
    <div
      className="relative rounded-[16px] group transition-transform duration-300 hover:-translate-y-1"
      style={{ ...SURFACE_STYLE, paddingLeft: '28px', paddingRight: '28px', paddingTop: '20px', paddingBottom: '20px' }}
    >
      {/* soft glow blob — clipped by inner wrapper so card itself never clips text */}
      <div className="absolute inset-0 rounded-[16px] overflow-hidden pointer-events-none">
        <div
          className="absolute -top-16 -right-16 w-44 h-44 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(closest-side, ${tone.glow}, transparent 70%)` }}
        />
      </div>

      <div className="relative flex items-start justify-between">
        <span
          className="text-[9px] font-semibold uppercase tracking-[0.24em]"
          style={{ color: 'rgba(90,169,230,0.7)' }}
        >
          {label}
        </span>
        <span
          className="flex items-center justify-center w-10 h-10 rounded-[14px]"
          style={{
            color: tone.fg,
            background: `linear-gradient(135deg, ${tone.chipFrom} 0%, ${tone.chipTo} 100%)`,
            border: '1px solid rgba(90,169,230,0.25)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
          }}
        >
          {icon}
        </span>
      </div>

      <div className="relative mt-5">
        <p
          className="font-serif-display tabular leading-[0.9]"
          style={{ fontSize: 56, color: '#5aa9e6' }}
        >
          {value}
        </p>
      </div>

      <p className="relative mt-3 text-[12px] leading-snug" style={{ color: 'rgba(90,169,230,0.72)' }}>
        {sub}
      </p>

      {hint && (
        <div
          className="relative mt-4 pt-3 flex items-center justify-between text-[10px] font-medium"
          style={{ borderTop: '1px dashed rgba(90,169,230,0.22)', color: 'rgba(90,169,230,0.65)' }}
        >
          <span className="uppercase tracking-[0.18em]">{hint}</span>
          <span style={{ color: tone.fg }}>●</span>
        </div>
      )}
    </div>
  );
}

// ─── hero success-rate card with SVG arc ─────────────────────────────────────

function SuccessArc({ rate, successPosts, resolvedPosts }) {
  const size = 220;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = rate == null ? 0 : Math.max(0, Math.min(100, rate));
  const offset = c - (pct / 100) * c;

  return (
    <div
      className="relative h-full rounded-[16px] flex flex-col md:flex-row items-stretch gap-8 group transition-transform duration-300 hover:-translate-y-1"
      style={{ ...SURFACE_STYLE, paddingLeft: '30px', paddingRight: '30px', paddingTop: '22px', paddingBottom: '22px' }}
    >
      {/* glow — clipped by inner wrapper only */}
      <div className="absolute inset-0 rounded-[16px] overflow-hidden pointer-events-none">
        <div
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(127,200,248,0.55), transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 -right-16 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(255,99,146,0.35), transparent 70%)' }}
        />
      </div>

      <div className="relative flex-1 flex flex-col justify-between">
        <div>
          <span
            className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.24em] px-2.5 py-1 rounded-full"
            style={{
              color: '#5aa9e6',
              background: 'rgba(127,200,248,0.22)',
              border: '1px solid rgba(90,169,230,0.3)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#ffe45e' }} />
            Automation health
          </span>
          <h2
            className="font-serif-display mt-4 leading-[0.9]"
            style={{ fontSize: 56, color: '#5aa9e6' }}
          >
            Success<br />
            <span style={{ fontStyle: 'italic', color: '#ff6392' }}>rate</span>
          </h2>
        </div>
        <p className="text-[12px] mt-5 max-w-[36ch] leading-relaxed" style={{ color: 'rgba(90,169,230,0.78)' }}>
          {resolvedPosts === 0
            ? 'No automation runs yet. As soon as posts resolve, their success signal surfaces here.'
            : `${successPosts} of ${resolvedPosts} resolved posts landed cleanly across platforms.`}
        </p>
      </div>

      <div className="relative flex items-center justify-center shrink-0">
        <svg width={size} height={size} className="-rotate-90" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="arc-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5aa9e6" />
              <stop offset="55%" stopColor="#ff6392" />
              <stop offset="100%" stopColor="#ffe45e" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(90,169,230,0.14)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="url(#arc-grad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.2,0.8,0.2,1)',
              filter: 'drop-shadow(0 10px 20px rgba(90,169,230,0.35))',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif-display tabular leading-none" style={{ fontSize: 56, color: '#5aa9e6' }}>
            {rate == null ? '—' : rate}
            {rate != null && (
              <span className="font-serif-display" style={{ fontSize: 24, color: '#ff6392' }}>
                %
              </span>
            )}
          </span>
          <span
            className="mt-2 text-[9px] font-semibold uppercase tracking-[0.26em]"
            style={{ color: 'rgba(90,169,230,0.7)' }}
          >
            resolved
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { data: listingsData, loading: ll, error: le } = useFetch('/api/listings');
  const { data: postsData,    loading: pl, error: pe } = useFetch('/api/posts');
  const { data: logsData,     loading: gl, error: ge } = useFetch('/api/logs');

  const loading = ll || pl || gl;
  const error   = le || pe || ge;

  const listings = listingsData?.listings ?? [];
  const posts    = postsData?.posts       ?? [];
  const logs     = logsData?.logs         ?? [];

  // ── derived stats ──────────────────────────────────────────────────────────
  const successPosts  = posts.filter(p => p.status === 'posted').length;
  const failedPosts   = posts.filter(p => p.status === 'failed').length;
  const pendingPosts  = posts.filter(p => p.status === 'pending' || p.status === 'draft').length;
  const resolvedPosts = successPosts + failedPosts;
  const successRate   = resolvedPosts > 0 ? Math.round((successPosts / resolvedPosts) * 100) : null;

  const successLogs = logs.filter(l => l.status === 'success').length;
  const failedLogs  = logs.filter(l => l.status === 'failed').length;

  return (
    <>
      {error && <ErrorState message={error} />}

      {loading ? (
        <LoadingState />
      ) : (
        <div className="px-10 md:px-14 pb-16 pt-6 max-w-[1400px] mx-auto">

          {/* Editorial greeting */}
          <section className="rise rise-1 pt-6 pb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span
                className="text-[9px] font-semibold uppercase tracking-[0.28em]"
                style={{ color: 'rgba(90,169,230,0.6)' }}
              >
                Overview · {new Date().getFullYear()}
              </span>
              <h1
                className="font-serif-display mt-2 leading-[0.88]"
                style={{
                  fontSize: 'clamp(52px, 7vw, 92px)',
                  color: '#5aa9e6',
                }}
              >
                {getGreeting()}
                <span style={{ fontStyle: 'italic', color: '#ff6392' }}>,</span>
                <br />
                <span style={{ color: 'rgba(90,169,230,0.55)' }}>
                  let&rsquo;s look at the <span style={{ color: '#ffe45e' }}>numbers</span>.
                </span>
              </h1>
            </div>
            <div
              className="flex items-center gap-4 pl-5 shrink-0"
              style={{ borderLeft: '1px solid rgba(90,169,230,0.28)' }}
            >
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em]" style={{ color: 'rgba(90,169,230,0.6)' }}>
                  Today
                </p>
                <p className="font-serif-display text-[22px] leading-tight mt-1" style={{ color: '#5aa9e6' }}>
                  {formatDate()}
                </p>
              </div>
            </div>
          </section>

          {/* Stats: hero + 3 stacked */}
          <section className="grid grid-cols-1 xl:grid-cols-3" style={{ gap: '1.45rem', marginBottom: '1.45rem' }}>
            <div className="xl:col-span-2 rise rise-2 h-full">
              <SuccessArc rate={successRate} successPosts={successPosts} resolvedPosts={resolvedPosts} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 rise rise-3 h-full" style={{ gap: '1.45rem' }}>
              <StatCard
                label="Total Listings"
                value={listings.length}
                sub={
                  listings.length === 0
                    ? 'No listings yet'
                    : `${listings.length} propert${listings.length === 1 ? 'y' : 'ies'} in database`
                }
                icon={<BuildingIcon />}
                accent="sky"
                hint="Live index"
              />
              <StatCard
                label="Generated Posts"
                value={posts.length}
                sub={
                  posts.length === 0
                    ? 'No posts yet'
                    : `${successPosts} posted · ${pendingPosts} pending`
                }
                icon={<FileIcon />}
                accent="rose"
                hint="Pipeline"
              />
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 rise rise-4" style={{ gap: '1.45rem', marginBottom: '1.45rem' }}>
            <StatCard
              label="Total Logs"
              value={logs.length}
              sub={
                logs.length === 0
                  ? 'No activity yet'
                  : `${successLogs} success · ${failedLogs} failed`
              }
              icon={<TerminalIcon />}
              accent="sun"
              hint="Telemetry"
            />
            <div
              className="rounded-[16px] relative group transition-transform duration-300 hover:-translate-y-1"
              style={{ ...SURFACE_STYLE, paddingLeft: '28px', paddingRight: '28px', paddingTop: '12px', paddingBottom: '20px' }}
            >
              <div className="absolute inset-0 rounded-[16px] overflow-hidden pointer-events-none">
                <div
                  className="absolute -top-16 -right-16 w-44 h-44 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(closest-side, rgba(255,228,94,0.8), transparent 70%)' }}
                />
              </div>
              <div className="relative">
                <span
                  className="text-[9px] font-semibold uppercase tracking-[0.24em]"
                  style={{ color: 'rgba(90,169,230,0.7)' }}
                >
                  Pending queue
                </span>
                <p
                  className="font-serif-display tabular leading-[0.9]"
                  style={{ fontSize: 56, color: '#5aa9e6', marginTop: '20px' }}
                >
                  {pendingPosts}
                </p>
                <p className="mt-3 text-[12px]" style={{ color: 'rgba(90,169,230,0.72)' }}>
                  {pendingPosts === 0 ? 'Queue is clear.' : 'Posts awaiting their moment.'}
                </p>
                <div
                  className="mt-5 pt-4 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.18em]"
                  style={{ borderTop: '1px dashed rgba(90,169,230,0.22)', color: 'rgba(90,169,230,0.65)' }}
                >
                  <span>Awaiting</span>
                  <span style={{ color: '#ffe45e' }}>●</span>
                </div>
              </div>
            </div>
          </section>

          {/* Panels: Recent Posts + Recent Logs */}
          <section className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: '1.45rem', marginBottom: '1.45rem' }}>
            {/* Recent Posts */}
            <PanelCard
              eyebrow="Recent"
              title="Posts"
              count={posts.length}
              to="/posts"
              delayClass="rise-5"
            >
              {posts.length === 0 ? (
                <EmptyRow text="No posts yet." />
              ) : (
                posts.slice(0, 3).map((post, idx) => {
                  const barColor =
                    post.status === 'failed'
                      ? '#ff6392'
                      : post.status === 'pending' || post.status === 'draft'
                      ? '#ffe45e'
                      : '#5aa9e6';
                  return (
                    <Row
                      key={post.id}
                      isLast={idx === Math.min(posts.length, 3) - 1}
                      barColor={barColor}
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <p
                          className="font-serif-display text-[22px] leading-[1.1] truncate"
                          style={{ color: '#5aa9e6' }}
                        >
                          {post.address}
                        </p>
                        <p
                          className="text-[13px] mt-2 leading-snug line-clamp-2"
                          style={{ color: 'rgba(90,169,230,0.78)' }}
                        >
                          {post.caption}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <StatusBadge status={post.status} />
                        <span
                          className="text-[9.5px] font-semibold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
                          style={{
                            color: '#5aa9e6',
                            background: 'rgba(127,200,248,0.2)',
                            border: '1px solid rgba(90,169,230,0.28)',
                          }}
                        >
                          {post.platform}
                        </span>
                      </div>
                    </Row>
                  );
                })
              )}
            </PanelCard>

            {/* Recent Logs */}
            <PanelCard
              eyebrow="Recent"
              title="Logs"
              count={logs.length}
              to="/logs"
              delayClass="rise-6"
            >
              {logs.length === 0 ? (
                <EmptyRow text="No logs yet." />
              ) : (
                logs.slice(0, 3).map((log, idx) => {
                  const barColor =
                    log.status === 'failed'
                      ? '#ff6392'
                      : log.status === 'success'
                      ? '#5aa9e6'
                      : '#ffe45e';
                  return (
                    <Row
                      key={log.id}
                      isLast={idx === Math.min(logs.length, 3) - 1}
                      barColor={barColor}
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <div
                          className="text-[9.5px] font-semibold uppercase tracking-[0.22em] mb-1.5"
                          style={{ color: 'rgba(255,99,146,0.85)' }}
                        >
                          {log.event_type}
                        </div>
                        <p
                          className="text-[15px] leading-snug font-medium truncate"
                          style={{ color: '#5aa9e6' }}
                        >
                          {log.message}
                        </p>
                        <p
                          className="text-[12px] mt-1.5 truncate"
                          style={{ color: 'rgba(90,169,230,0.7)' }}
                        >
                          {log.address}
                        </p>
                      </div>
                      <StatusBadge status={log.status} />
                    </Row>
                  );
                })
              )}
            </PanelCard>
          </section>

        </div>
      )}
    </>
  );
}
