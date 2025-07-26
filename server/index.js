// Universal module loader
try {
    // Try ES module import first
    import('module-alias/register');
} catch (e) {
    // Fallback to CommonJS require
    require('module-alias/register');
}

// Now use require normally
const express = require('express');
const mongoose = require('mongoose');
// ... other requires
