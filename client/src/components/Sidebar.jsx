import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', hint: '01' },
  { to: '/listings', label: 'Listings', hint: '02' },
  { to: '/posts', label: 'Posts', hint: '03' },
  { to: '/logs', label: 'Logs', hint: '04' },
];

export default function Sidebar() {
  return (
    <aside
      className="shrink-0 flex flex-col rounded-[20px] sticky top-4 self-start"
      style={{
        width: '240px',
        background: 'linear-gradient(180deg, rgba(249,249,249,0.88) 0%, rgba(249,249,249,0.68) 100%)',
        border: '1px solid rgba(90,169,230,0.22)',
        boxShadow:
          '0 40px 80px -40px rgba(90,169,230,0.35), 0 20px 40px -22px rgba(255,99,146,0.16), inset 0 1px 0 rgba(255,255,255,0.9)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        minHeight: 'calc(100vh - 2rem)',
      }}
    >
      {/* Brand */}
      <div style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '28px', paddingBottom: '24px' }} className="relative">
        <h1
          className="font-serif-display leading-[0.95] text-[30px]"
          style={{ color: '#5aa9e6' }}
        >
          Real<span style={{ fontStyle: 'italic', color: '#ff6392' }}>estate</span>
          <br />
          Automation
          <span style={{ color: '#ffe45e' }}>.</span>
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex flex-col flex-1" style={{ gap: '6px', paddingLeft: '12px', paddingRight: '12px' }}>
        <p
          className="text-[9px] font-semibold uppercase tracking-[0.24em]"
          style={{ color: 'rgba(90,169,230,0.55)', paddingLeft: '12px', paddingTop: '8px', paddingBottom: '8px' }}
        >
          Workspace
        </p>
        {links.map(({ to, label, hint }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `group relative rounded-[14px] text-[13px] font-medium transition-all duration-200 flex items-center justify-between overflow-hidden ${
                isActive ? 'nav-pulse' : ''
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    color: '#f9f9f9',
                    background: 'linear-gradient(135deg, #5aa9e6 0%, #7fc8f8 100%)',
                    boxShadow:
                      '0 14px 30px -14px rgba(90,169,230,0.7), 0 6px 14px -6px rgba(255,99,146,0.35), inset 0 1px 0 rgba(255,255,255,0.45)',
                    padding: '12px 16px',
                  }
                : {
                    color: 'rgba(90,169,230,0.78)',
                    background: 'transparent',
                    padding: '12px 16px',
                  }
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center" style={{ gap: '12px' }}>
                  <span
                    className="font-serif-display text-[13px] tabular"
                    style={{
                      color: isActive ? 'rgba(249,249,249,0.75)' : 'rgba(90,169,230,0.45)',
                    }}
                  >
                    {hint}
                  </span>
                  <span>{label}</span>
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Live badge */}
      <div className="flex justify-center" style={{ paddingLeft: '24px', paddingRight: '24px', marginBottom: '40px' }}>
        <div
          className="inline-flex items-center uppercase tracking-[0.22em] font-semibold rounded-full"
          style={{
            fontSize: '10px',
            color: '#5aa9e6',
            background: 'rgba(127,200,248,0.18)',
            border: '1px solid rgba(90,169,230,0.3)',
            gap: '8px',
            padding: '6px 12px',
          }}
        >
          <span className="rounded-full" style={{ width: '6px', height: '6px', background: '#ff6392' }} />
          Live
        </div>
      </div>
    </aside>
  );
}
