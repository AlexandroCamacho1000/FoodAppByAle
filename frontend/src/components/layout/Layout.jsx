import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F8FAFC] via-white to-[#F1F5F9]">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* ← REEMPLAZAR children con Outlet */}
      </main>
      <Footer />
    </div>
  );
}