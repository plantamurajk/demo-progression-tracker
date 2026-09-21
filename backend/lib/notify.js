// Notification seam for request lifecycle events.
//
// This is intentionally a no-op for now. It gives us a single place to later
// wire up Slack DMs / channel posts (or email) when requests are created or
// responded to, without touching the route handlers again.
//
// event shape: { kind, request, employeeId, actorId }
//   kind:       'created' | 'responded'
//   request:    the request row (id, type, station_id, module_id, status, ...)
//   employeeId: the employee the request belongs to
//   actorId:    the employee who triggered the event (may be undefined)
function notifyRequestEvent(event) {
  try {
    if (process.env.NOTIFY_DEBUG === 'true') {
      console.log('[notify] request event:', JSON.stringify(event));
    }
    // No external delivery yet — placeholder for future Slack/email integration.
  } catch (err) {
    // Never let notification failures break the request flow.
    console.error('[notify] failed:', err.message);
  }
}

module.exports = { notifyRequestEvent };
