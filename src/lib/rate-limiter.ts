"use client"

// A simple client-side rate limiter to prevent spamming citation requests
// In a real production app, this should be handled on the server/middleware level.

const citationRequests: number[] = [];
const LIMIT = 5; // 5 requests
const WINDOW = 60 * 1000; // per 1 minute

export function checkRateLimit(): boolean {
  const now = Date.now();
  
  // Filter out requests outside the window
  while (citationRequests.length > 0 && citationRequests[0] < now - WINDOW) {
    citationRequests.shift();
  }
  
  if (citationRequests.length >= LIMIT) {
    return false;
  }
  
  citationRequests.push(now);
  return true;
}
