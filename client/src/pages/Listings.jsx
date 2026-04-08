import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import { LoadingState, ErrorState } from '../components/LoadingSpinner';

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatPrice(price) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency', currency: 'CAD', maximumFractionDigits: 0,
  }).format(price);
}

// ─── icons ───────────────────────────────────────────────────────────────────

function TableIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="9" x2="9" y2="21" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ─── action button ────────────────────────────────────────────────────────────

function ActionButton({ label, loadingLabel, icon, variant, status, message, onClick }) {
  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError   = status === 'error';
  const isIdle    = status === 'idle';

  let colorClass;
  if (isLoading) {
    colorClass = 'bg-[#F7F8FA] text-[#9CA3AF] border-[#E8EBF0] cursor-not-allowed';
  } else if (isSuccess) {
    colorClass = 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]';
  } else if (isError) {
    colorClass = 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]';
  } else if (variant === 'primary') {
    colorClass = 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] hover:bg-[#DBEAFE] cursor-pointer';
  } else {
    colorClass = 'bg-white text-[#6B7280] border-[#E8EBF0] hover:bg-[#F7F8FA] cursor-pointer';
  }

  const displayMsg = isError && message.length > 22 ? message.slice(0, 22) + '…' : message;

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      title={isError ? message : undefined}
      className={`inline-flex items-center rounded-[5px] text-[11.5px] font-medium border transition-colors select-none ${colorClass}`}
      style={{ gap: '6px', padding: '6px 10px' }}
    >
      {isLoading ? <SpinnerIcon />
        : isSuccess ? <CheckIcon />
        : isError   ? <AlertIcon />
        : icon}

      {isLoading ? loadingLabel
        : isSuccess ? displayMsg
        : isError   ? displayMsg
        : label}
    </button>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function Listings() {
  const { data, loading, error, refetch } = useFetch('/api/listings');
  const listings = data?.listings ?? [];

  const [actions, setActions] = useState({});

  function getActionStatus(id, type) {
    return actions[id]?.[type]?.status ?? 'idle';
  }

  function getActionMessage(id, type) {
    return actions[id]?.[type]?.message ?? '';
  }

  function setAction(id, type, status, message = '') {
    setActions(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: { status, message },
      },
    }));
  }

  function scheduleReset(id, type, delay) {
    setTimeout(() => setAction(id, type, 'idle'), delay);
  }

  async function handleProcess(id) {
    setAction(id, 'process', 'loading');
    try {
      const res  = await fetch(`/api/listings/${id}/process`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Server error ${res.status}`);
      setAction(id, 'process', 'success', 'Caption saved');
      scheduleReset(id, 'process', 4000);
    } catch (err) {
      setAction(id, 'process', 'error', err.message);
      scheduleReset(id, 'process', 6000);
    }
  }

  async function handleAutomate(id) {
    setAction(id, 'automation', 'loading');
    try {
      const res  = await fetch(`/api/listings/${id}/send-to-automation`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Server error ${res.status}`);
      setAction(id, 'automation', 'success', 'Sent to n8n');
      scheduleReset(id, 'automation', 4000);
    } catch (err) {
      setAction(id, 'automation', 'error', err.message);
      scheduleReset(id, 'automation', 6000);
    }
  }

  return (
    <>
      {error && <ErrorState message={error} />}

      {loading ? (
        <LoadingState />
      ) : (
        <div style={{ padding: '28px' }}>
          <div style={{ marginBottom: '20px' }}>
            <p className="text-[13px] text-[#9CA3AF]">Sold Toronto properties in the database</p>
          </div>

          <div className="bg-white rounded-[8px] border border-[#E8EBF0] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8EBF0]">
                  {['Address', 'Neighborhood', 'Price', 'Beds', 'Baths', 'Sold Date', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-[0.06em] bg-[#FBFBFC]" style={{ padding: '12px 20px' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-[13px] text-[#9CA3AF]" style={{ padding: '32px 20px' }}>
                      No listings found.
                    </td>
                  </tr>
                ) : (
                  listings.map(listing => (
                    <tr key={listing.id} className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#F7F8FA] transition-colors">
                      <td className="text-[13px] font-medium text-[#1C1F26]" style={{ padding: '14px 20px' }}>{listing.address}</td>
                      <td className="text-[13px] text-[#6B7280]" style={{ padding: '14px 20px' }}>{listing.neighborhood}</td>
                      <td className="text-[13px] font-medium text-[#1C1F26]" style={{ padding: '14px 20px' }}>{formatPrice(listing.price)}</td>
                      <td className="text-[13px] text-[#6B7280]" style={{ padding: '14px 20px' }}>{listing.beds}</td>
                      <td className="text-[13px] text-[#6B7280]" style={{ padding: '14px 20px' }}>{listing.baths}</td>
                      <td className="text-[12.5px] text-[#9CA3AF]" style={{ padding: '14px 20px' }}>{listing.sold_date}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <div className="flex items-center" style={{ gap: '8px' }}>
                          <ActionButton
                            label="Process"
                            loadingLabel="Processing…"
                            icon={<SparkleIcon />}
                            variant="primary"
                            status={getActionStatus(listing.id, 'process')}
                            message={getActionMessage(listing.id, 'process')}
                            onClick={() => handleProcess(listing.id)}
                          />
                          <ActionButton
                            label="Send"
                            loadingLabel="Sending…"
                            icon={<SendIcon />}
                            variant="secondary"
                            status={getActionStatus(listing.id, 'automation')}
                            message={getActionMessage(listing.id, 'automation')}
                            onClick={() => handleAutomate(listing.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
