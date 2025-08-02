import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AutoTrading() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">🚀 Automated Trading</h1>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Automated Trading Systems</h2>
            <p className="mb-4">This feature is coming soon. Stay tuned for automated trading capabilities.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
