import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AlgoTrading() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">🤖 Algorithmic Trading</h1>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Algorithmic Trading Strategies</h2>
            <p className="mb-4">This feature is coming soon. Stay tuned for advanced algorithmic trading capabilities.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
