// Allow .jsx imports in TypeScript
declare module '*.jsx' {
  import React from 'react';
  const component: React.ComponentType;
  export default component;
}

// Declare types for your JavaScript files
declare module './components/Layout' {
  import React from 'react';
  const Layout: React.ComponentType;
  export default Layout;
}

declare module './components/Loader' {
  import React from 'react';
  const Loader: React.ComponentType;
  export default Loader;
}

// Add similar declarations for other components
