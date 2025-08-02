import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const PageLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && (
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-gray-600">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PageLayout;
