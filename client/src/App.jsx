import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Listings from './pages/Listings';
import Posts from './pages/Posts';
import Logs from './pages/Logs';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen" style={{ padding: '16px', gap: '16px' }}>
        <Sidebar />
        <main
          className="flex-1 rounded-[20px] relative isolate"
          style={{
            marginTop: '16px',
            paddingLeft: '25px',
            paddingRight: '25px',
            paddingTop: '25px',
            background: 'linear-gradient(180deg, rgba(249,249,249,0.82) 0%, rgba(249,249,249,0.62) 100%)',
            border: '1px solid rgba(90,169,230,0.18)',
            boxShadow:
              '0 40px 80px -40px rgba(90,169,230,0.28), 0 18px 40px -22px rgba(255,99,146,0.14), inset 0 1px 0 rgba(255,255,255,0.8)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
