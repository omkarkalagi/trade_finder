// Mock crypto implementation for demo purposes
const mockCrypto = {
  lib: {
    WordArray: {
      random: (bytes) => ({
        toString: () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      })
    }
  },
  AES: {
    encrypt: (data, key) => ({
      toString: () => btoa(data + '|' + key)
    }),
    decrypt: (encrypted, key) => ({
      toString: (enc) => {
        try {
          const decoded = atob(encrypted);
          const [data] = decoded.split('|');
          return data;
        } catch {
          return '';
        }
      }
    })
  },
  SHA256: (data) => ({
    toString: () => btoa(data).replace(/[^a-zA-Z0-9]/g, '').substring(0, 64)
  }),
  enc: {
    Utf8: 'utf8'
  }
};

class SecurityService {
  constructor() {
    this.encryptionKey = this.generateEncryptionKey();
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.maxLoginAttempts = 5;
    this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
    this.securitySettings = {
      twoFactorEnabled: false,
      biometricEnabled: false,
      sessionTimeout: 30,
      autoLogout: true,
      encryptLocalData: true,
      secureApiCalls: true,
      ipWhitelisting: false,
      deviceTrust: true
    };

    this.loginAttempts = new Map();
    this.trustedDevices = new Set();
    this.securityAlerts = [];

    this.loadSecuritySettings();
    this.initializeSecurityMonitoring();
  }

  // Generate encryption key for local data
  generateEncryptionKey() {
    let key = localStorage.getItem('trade_finder_key');
    if (!key) {
      key = mockCrypto.lib.WordArray.random(256/8).toString();
      localStorage.setItem('trade_finder_key', key);
    }
    return key;
  }

  // Load security settings
  loadSecuritySettings() {
    try {
      const settings = localStorage.getItem('securitySettings');
      if (settings) {
        this.securitySettings = { ...this.securitySettings, ...JSON.parse(settings) };
      }
    } catch (error) {
      console.error('Error loading security settings:', error);
    }
  }

  // Save security settings
  saveSecuritySettings() {
    try {
      localStorage.setItem('securitySettings', JSON.stringify(this.securitySettings));
    } catch (error) {
      console.error('Error saving security settings:', error);
    }
  }

  // Encrypt sensitive data
  encryptData(data) {
    if (!this.securitySettings.encryptLocalData) {
      return data;
    }

    try {
      const encrypted = mockCrypto.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      return data;
    }
  }

  // Decrypt sensitive data
  decryptData(encryptedData) {
    if (!this.securitySettings.encryptLocalData) {
      return encryptedData;
    }

    try {
      const bytes = mockCrypto.AES.decrypt(encryptedData, this.encryptionKey);
      const decrypted = bytes.toString(mockCrypto.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  // Validate login attempt
  validateLoginAttempt(phoneNumber, otp) {
    const now = Date.now();
    const attemptKey = phoneNumber;

    // Check if account is locked
    if (this.loginAttempts.has(attemptKey)) {
      const attempts = this.loginAttempts.get(attemptKey);
      if (attempts.count >= this.maxLoginAttempts) {
        const timeSinceLock = now - attempts.lastAttempt;
        if (timeSinceLock < this.lockoutDuration) {
          const remainingTime = Math.ceil((this.lockoutDuration - timeSinceLock) / 60000);
          return {
            success: false,
            error: `Account locked. Try again in ${remainingTime} minutes.`,
            locked: true
          };
        } else {
          // Reset attempts after lockout period
          this.loginAttempts.delete(attemptKey);
        }
      }
    }

    // Simulate OTP validation (in real app, this would validate with Twilio)
    const isValidOTP = this.validateOTP(phoneNumber, otp);

    if (isValidOTP) {
      // Reset login attempts on successful login
      this.loginAttempts.delete(attemptKey);

      // Log security event
      this.logSecurityEvent('login_success', { phoneNumber });

      return { success: true };
    } else {
      // Increment failed attempts
      const attempts = this.loginAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 };
      attempts.count++;
      attempts.lastAttempt = now;
      this.loginAttempts.set(attemptKey, attempts);

      // Log security event
      this.logSecurityEvent('login_failed', { phoneNumber, attempts: attempts.count });

      const remainingAttempts = this.maxLoginAttempts - attempts.count;
      return {
        success: false,
        error: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
        remainingAttempts
      };
    }
  }

  // Validate OTP (mock implementation)
  validateOTP(phoneNumber, otp) {
    // In real implementation, this would validate with Twilio
    // For demo purposes, accept any 6-digit number
    return /^\d{6}$/.test(otp);
  }

  // Initialize session with security checks
  initializeSession(user) {
    const sessionData = {
      user,
      startTime: Date.now(),
      lastActivity: Date.now(),
      deviceFingerprint: this.generateDeviceFingerprint(),
      ipAddress: this.getCurrentIP(),
      sessionId: this.generateSessionId()
    };

    // Encrypt and store session
    const encryptedSession = this.encryptData(sessionData);
    sessionStorage.setItem('trade_finder_session', encryptedSession);

    // Set auto-logout timer
    if (this.securitySettings.autoLogout) {
      this.setAutoLogoutTimer();
    }

    // Check device trust
    this.checkDeviceTrust(sessionData.deviceFingerprint);

    return sessionData;
  }

  // Generate device fingerprint
  generateDeviceFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);

    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL(),
      timestamp: Date.now()
    };

    return mockCrypto.SHA256(JSON.stringify(fingerprint)).toString();
  }

  // Generate session ID
  generateSessionId() {
    return mockCrypto.lib.WordArray.random(128/8).toString();
  }

  // Get current IP (mock implementation)
  getCurrentIP() {
    // In real implementation, this would get the actual IP
    return '192.168.1.1';
  }

  // Check device trust
  checkDeviceTrust(fingerprint) {
    if (this.securitySettings.deviceTrust) {
      if (!this.trustedDevices.has(fingerprint)) {
        this.logSecurityEvent('new_device_detected', { fingerprint });
        // In real app, would send notification to user
        console.log('New device detected - security notification sent');
      } else {
        this.trustedDevices.add(fingerprint);
      }
    }
  }

  // Set auto-logout timer
  setAutoLogoutTimer() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    this.logoutTimer = setTimeout(() => {
      this.logout('session_timeout');
    }, this.sessionTimeout);
  }

  // Update session activity
  updateActivity() {
    const session = this.getCurrentSession();
    if (session) {
      session.lastActivity = Date.now();
      const encryptedSession = this.encryptData(session);
      sessionStorage.setItem('trade_finder_session', encryptedSession);

      // Reset auto-logout timer
      if (this.securitySettings.autoLogout) {
        this.setAutoLogoutTimer();
      }
    }
  }

  // Get current session
  getCurrentSession() {
    try {
      const encryptedSession = sessionStorage.getItem('trade_finder_session');
      if (encryptedSession) {
        return this.decryptData(encryptedSession);
      }
    } catch (error) {
      console.error('Error getting session:', error);
    }
    return null;
  }

  // Validate session
  validateSession() {
    const session = this.getCurrentSession();
    if (!session) {
      return { valid: false, reason: 'no_session' };
    }

    const now = Date.now();
    const sessionAge = now - session.startTime;
    const inactivityTime = now - session.lastActivity;

    // Check session timeout
    if (sessionAge > this.sessionTimeout) {
      this.logout('session_expired');
      return { valid: false, reason: 'session_expired' };
    }

    // Check inactivity timeout
    if (inactivityTime > this.sessionTimeout) {
      this.logout('inactivity_timeout');
      return { valid: false, reason: 'inactivity_timeout' };
    }

    // Check device fingerprint
    const currentFingerprint = this.generateDeviceFingerprint();
    if (session.deviceFingerprint !== currentFingerprint) {
      this.logout('device_changed');
      this.logSecurityEvent('device_fingerprint_mismatch', {
        original: session.deviceFingerprint,
        current: currentFingerprint
      });
      return { valid: false, reason: 'device_changed' };
    }

    return { valid: true, session };
  }

  // Logout user
  logout(reason = 'user_initiated') {
    // Clear session data
    sessionStorage.removeItem('trade_finder_session');

    // Clear auto-logout timer
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }

    // Log security event
    this.logSecurityEvent('logout', { reason });

    // Redirect to login page
    window.location.href = '/login';
  }

  // Log security events
  logSecurityEvent(event, data = {}) {
    const securityEvent = {
      id: Date.now(),
      event,
      data,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      ip: this.getCurrentIP()
    };

    this.securityAlerts.unshift(securityEvent);

    // Keep only last 100 events
    if (this.securityAlerts.length > 100) {
      this.securityAlerts = this.securityAlerts.slice(0, 100);
    }

    // Store in localStorage (encrypted)
    const encryptedAlerts = this.encryptData(this.securityAlerts);
    localStorage.setItem('securityAlerts', encryptedAlerts);

    console.log('Security event logged:', event, data);
  }

  // Get security alerts
  getSecurityAlerts(limit = 20) {
    return this.securityAlerts.slice(0, limit);
  }

  // Initialize security monitoring
  initializeSecurityMonitoring() {
    // Monitor for suspicious activity
    this.monitorSuspiciousActivity();

    // Set up periodic security checks
    setInterval(() => {
      this.performSecurityCheck();
    }, 60000); // Check every minute
  }

  // Monitor suspicious activity
  monitorSuspiciousActivity() {
    // Monitor for rapid API calls
    let apiCallCount = 0;
    const apiCallWindow = 60000; // 1 minute

    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      apiCallCount++;

      // Reset counter after window
      setTimeout(() => {
        apiCallCount = Math.max(0, apiCallCount - 1);
      }, apiCallWindow);

      // Check for suspicious activity
      if (apiCallCount > 100) { // More than 100 API calls per minute
        this.logSecurityEvent('suspicious_api_activity', { callCount: apiCallCount });
      }

      return originalFetch.apply(this, args);
    };
  }

  // Perform periodic security check
  performSecurityCheck() {
    // Validate current session
    const sessionValidation = this.validateSession();
    if (!sessionValidation.valid) {
      return;
    }

    // Update activity
    this.updateActivity();

    // Check for security threats
    this.checkSecurityThreats();
  }

  // Check for security threats
  checkSecurityThreats() {
    // Check for multiple tabs (potential session hijacking)
    if (document.visibilityState === 'visible') {
      const tabId = sessionStorage.getItem('tabId') || Math.random().toString(36);
      sessionStorage.setItem('tabId', tabId);

      // In real implementation, would check for multiple active sessions
    }
  }

  // Update security settings
  updateSecuritySettings(newSettings) {
    this.securitySettings = { ...this.securitySettings, ...newSettings };
    this.saveSecuritySettings();

    // Apply new settings
    if (newSettings.sessionTimeout) {
      this.sessionTimeout = newSettings.sessionTimeout * 60 * 1000;
      this.setAutoLogoutTimer();
    }
  }

  // Get security status
  getSecurityStatus() {
    const session = this.getCurrentSession();
    return {
      isAuthenticated: !!session,
      sessionValid: this.validateSession().valid,
      twoFactorEnabled: this.securitySettings.twoFactorEnabled,
      deviceTrusted: session ? this.trustedDevices.has(session.deviceFingerprint) : false,
      lastActivity: session ? new Date(session.lastActivity) : null,
      securityLevel: this.calculateSecurityLevel()
    };
  }

  // Calculate security level
  calculateSecurityLevel() {
    let score = 0;

    if (this.securitySettings.twoFactorEnabled) score += 25;
    if (this.securitySettings.biometricEnabled) score += 20;
    if (this.securitySettings.encryptLocalData) score += 20;
    if (this.securitySettings.deviceTrust) score += 15;
    if (this.securitySettings.autoLogout) score += 10;
    if (this.securitySettings.ipWhitelisting) score += 10;

    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    if (score >= 40) return 'Low';
    return 'Very Low';
  }
}

const securityService = new SecurityService();
export default securityService;
