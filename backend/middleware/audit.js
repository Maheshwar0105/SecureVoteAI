const AuditLog = require('../models/AuditLog');

const logActivity = (actionDescription) => {
  return async (req, res, next) => {
    // We run this post-response or during routing
    const originalSend = res.send;
    
    res.send = function (body) {
      // Capture the original response details
      res.send = originalSend;
      res.send(body);

      // Perform audit logging asynchronously so we don't delay the API response
      try {
        const userId = req.user ? req.user._id : null;
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
        const deviceFingerprint = req.headers['user-agent'] || 'unknown';
        const txHash = req.body && req.body.txHash ? req.body.txHash : null;

        AuditLog.create({
          userId,
          action: actionDescription,
          details: {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            params: req.params,
            query: req.query,
            // Exclude passwords or sensitive data from body
            body: req.body ? { ...req.body, password: req.body.password ? '[HIDDEN]' : undefined } : {}
          },
          ipAddress,
          deviceFingerprint,
          txHash
        }).catch(err => console.error('Error logging audit activity:', err));
      } catch (err) {
        console.error('Audit logging error:', err);
      }
    };

    next();
  };
};

module.exports = logActivity;
