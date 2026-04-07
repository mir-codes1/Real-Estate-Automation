const tones = {
  posted:  { bg: 'rgba(127,200,248,0.22)', fg: '#5aa9e6', dot: '#5aa9e6', ring: 'rgba(90,169,230,0.45)' },
  success: { bg: 'rgba(127,200,248,0.22)', fg: '#5aa9e6', dot: '#5aa9e6', ring: 'rgba(90,169,230,0.45)' },
  pending: { bg: 'rgba(255,228,94,0.32)',  fg: '#5aa9e6', dot: '#ffe45e', ring: 'rgba(255,228,94,0.75)' },
  draft:   { bg: 'rgba(255,228,94,0.32)',  fg: '#5aa9e6', dot: '#ffe45e', ring: 'rgba(255,228,94,0.75)' },
  failed:  { bg: 'rgba(255,99,146,0.18)',  fg: '#ff6392', dot: '#ff6392', ring: 'rgba(255,99,146,0.5)'  },
};

const fallback = { bg: 'rgba(90,169,230,0.12)', fg: '#5aa9e6', dot: '#7fc8f8', ring: 'rgba(90,169,230,0.3)' };

export default function StatusBadge({ status }) {
  const t = tones[status] ?? fallback;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9.5px] font-semibold uppercase tracking-[0.16em]"
      style={{
        background: t.bg,
        color: t.fg,
        boxShadow: `inset 0 0 0 1px ${t.ring}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: t.dot, boxShadow: `0 0 0 2px ${t.bg}` }}
      />
      {status}
    </span>
  );
}
