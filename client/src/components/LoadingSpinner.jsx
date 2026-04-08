export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center" style={{ gap: '16px', paddingTop: '96px', paddingBottom: '96px' }}>
      <div className="relative w-12 h-12">
        <svg width="48" height="48" viewBox="0 0 48 48" className="animate-spin" style={{ animationDuration: '1.6s' }}>
          <defs>
            <linearGradient id="ls-g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5aa9e6" />
              <stop offset="50%" stopColor="#ff6392" />
              <stop offset="100%" stopColor="#ffe45e" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(90,169,230,0.12)" strokeWidth="3" />
          <circle
            cx="24" cy="24" r="20"
            fill="none"
            stroke="url(#ls-g1)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="50 200"
          />
        </svg>
      </div>
      <span
        className="text-[10px] font-semibold uppercase tracking-[0.3em]"
        style={{ color: 'rgba(90,169,230,0.75)' }}
      >
        Loading workspace
      </span>
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div
      className="flex items-start rounded-[16px]"
      style={{
        gap: '12px',
        marginLeft: '32px',
        marginRight: '32px',
        marginTop: '24px',
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '16px',
        paddingBottom: '16px',
        background:
          'linear-gradient(135deg, rgba(255,99,146,0.14) 0%, rgba(255,228,94,0.12) 100%)',
        border: '1px solid rgba(255,99,146,0.35)',
        color: '#ff6392',
        boxShadow: '0 20px 40px -24px rgba(255,99,146,0.35)',
      }}
    >
      <div
        className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
        style={{
          background: 'rgba(255,99,146,0.2)',
          border: '1px solid rgba(255,99,146,0.4)',
          color: '#ff6392',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#ff6392' }}>
          Connection interrupted
        </p>
        <p className="text-[13px] leading-snug" style={{ color: 'rgba(255,99,146,0.92)', marginTop: '4px' }}>
          Could not load data — {message}
        </p>
      </div>
    </div>
  );
}
