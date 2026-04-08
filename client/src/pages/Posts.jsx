import useFetch from '../hooks/useFetch';
import StatusBadge from '../components/StatusBadge';
import { LoadingState, ErrorState } from '../components/LoadingSpinner';

function PostsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

export default function Posts() {
  const { data, loading, error } = useFetch('/api/posts');
  const posts = data?.posts ?? [];

  return (
    <>
      {error && <ErrorState message={error} />}

      {loading ? (
        <LoadingState />
      ) : (
        <div style={{ padding: '28px' }}>
          <div style={{ marginBottom: '20px' }}>
            <p className="text-[13px] text-[#9CA3AF]">AI-generated captions queued for social posting</p>
          </div>

          {posts.length === 0 ? (
            <p className="text-[13px] text-[#9CA3AF]">No posts yet. Process a listing to generate one.</p>
          ) : (
            <div className="flex flex-col" style={{ gap: '12px' }}>
              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-[8px] border border-[#E8EBF0] hover:border-[#D1D5DB] transition-colors" style={{ padding: '20px' }}>

                  <div className="flex items-center justify-between" style={{ gap: '16px', marginBottom: '12px' }}>
                    <div className="min-w-0 flex items-baseline" style={{ gap: '6px' }}>
                      <span className="text-[13px] font-medium text-[#1C1F26]">{post.address}</span>
                      {post.neighborhood && (
                        <>
                          <span className="text-[#C9CDD5]">·</span>
                          <span className="text-[12.5px] text-[#6B7280]">{post.neighborhood}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center shrink-0" style={{ gap: '8px' }}>
                      <span className="text-[11.5px] font-medium text-[#9CA3AF] bg-[#F3F4F6] rounded-[4px] capitalize" style={{ padding: '2px 8px' }}>
                        {post.platform}
                      </span>
                      <StatusBadge status={post.status} />
                    </div>
                  </div>

                  <p className="text-[13px] text-[#6B7280] leading-[1.65]" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.caption}
                  </p>

                  <p className="text-[11.5px] text-[#9CA3AF]" style={{ marginTop: '12px' }}>{new Date(post.created_at).toLocaleString()}</p>

                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
