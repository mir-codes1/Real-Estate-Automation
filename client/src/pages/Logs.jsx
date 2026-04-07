import useFetch from '../hooks/useFetch';
import StatusBadge from '../components/StatusBadge';
import { LoadingState, ErrorState } from '../components/LoadingSpinner';

function LogsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

export default function Logs() {
  const { data, loading, error } = useFetch('/api/logs');
  const logs = data?.logs ?? [];

  return (
    <>
      {error && <ErrorState message={error} />}

      {loading ? (
        <LoadingState />
      ) : (
        <div className="p-7">
          <div className="mb-5">
            <p className="text-[13px] text-[#9CA3AF]">Automation pipeline activity and system events</p>
          </div>

          <div className="bg-white rounded-[8px] border border-[#E8EBF0] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8EBF0]">
                  {['Event', 'Address', 'Message', 'Status', 'Time'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-[0.06em] bg-[#FBFBFC]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-[13px] text-[#9CA3AF]">No logs yet.</td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id} className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#F7F8FA] transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="inline-block text-[11.5px] font-mono font-medium text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-[4px] whitespace-nowrap">
                          {log.event_type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-[#6B7280] whitespace-nowrap">{log.address}</td>
                      <td className="px-5 py-3.5 text-[13px] text-[#6B7280] max-w-xs truncate">{log.message}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={log.status} /></td>
                      <td className="px-5 py-3.5 text-[12px] text-[#9CA3AF] whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
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
