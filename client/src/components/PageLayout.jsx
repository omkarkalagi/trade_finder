import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const PageLayout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-0 p-4 lg:p-6 overflow-y-auto">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && (
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-gray-600 text-sm lg:text-base">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
