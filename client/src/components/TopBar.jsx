export default function TopBar({ icon, title, right }) {
  return (
    <div
      className="sticky top-4 z-20 flex items-center justify-between shrink-0 relative rounded-[16px]"
      style={{
        marginLeft: '16px',
        marginRight: '16px',
        marginTop: '16px',
        paddingLeft: '32px',
        paddingRight: '32px',
        paddingTop: '20px',
        paddingBottom: '20px',
        background: '#f9f9f9',
        border: '1px solid rgba(90,169,230,0.22)',
        boxShadow:
          '0 20px 40px -28px rgba(90,169,230,0.4), 0 8px 20px -14px rgba(255,99,146,0.18), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <div className="flex items-center" style={{ gap: '12px' }}>
        {icon && (
          <span
            className="flex items-center justify-center w-9 h-9 rounded-[12px]"
            style={{
              color: '#5aa9e6',
              background:
                'linear-gradient(135deg, rgba(127,200,248,0.28) 0%, rgba(255,228,94,0.22) 100%)',
              border: '1px solid rgba(90,169,230,0.28)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
            }}
          >
            {icon}
          </span>
        )}
        <div className="flex flex-col leading-tight">
          <span
            className="text-[9px] font-semibold uppercase tracking-[0.26em]"
            style={{ color: 'rgba(90,169,230,0.6)' }}
          >
            Souvenote / Workspace
          </span>
          <span
            className="font-serif-display text-[22px] leading-none"
            style={{ color: '#5aa9e6', marginTop: '2px' }}
          >
            {title}
            <span style={{ color: '#ff6392' }}>.</span>
          </span>
        </div>
      </div>
      {right && <div className="flex items-center" style={{ gap: '8px' }}>{right}</div>}

      {/* shimmer underline */}
      <div
        className="shimmer-underline absolute left-6 right-6 bottom-0 h-px"
        style={{ opacity: 0.9 }}
      />
    </div>
  );
}
