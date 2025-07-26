import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
        
        <footer className="py-4 px-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Trade Finder - Kalagi Group of Companies
        </footer>
      </div>
    </div>
  );
};

export default Layout; 