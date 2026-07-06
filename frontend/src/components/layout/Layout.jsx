import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F8FAFC] via-white to-[#F1F5F9]">
      <Navbar />
      <main className="flex-grow">
        <div key={location.pathname} className="animate-fadeIn">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}