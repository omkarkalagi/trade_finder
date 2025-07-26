// Universal require solution
(function() {
  if (typeof require === 'undefined') {
    const { createRequire } = (await import('module'));
    window.require = createRequire(import.meta.url);
  }
})();

// Now use require normally
const express = require('express');
const mongoose = require('mongoose');
// ... other requires
