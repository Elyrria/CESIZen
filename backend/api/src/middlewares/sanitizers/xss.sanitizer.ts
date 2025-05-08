import type { Request, Response, NextFunction } from "express"
import xss from 'xss'
import { logSecurityEvent } from "@logs/logger.ts"

/**
 * Sanitizes a string to prevent XSS attacks
 * 
 * @param {string} str - String to sanitize
 * @returns {object} - Sanitized string and detection info
 */
export const sanitizeString = (str: string): { result: string; changed: boolean } => {
  if (typeof str !== 'string') return { result: str, changed: false };
  
  const sanitized = xss(str);
  const changed = sanitized !== str;
  
  return { result: sanitized, changed };
}

/**
 * Recursively sanitizes an object to protect against XSS
 * 
 * @param {any} obj - Object to sanitize
 * @param {string} path - Current path in the object (for logging)
 * @returns {object} - Sanitized copy of the object with detection info
 */
export const deepXssSanitize = (obj: any, path = ''): { result: any; changes: string[] } => {
  const changes: string[] = [];
  
  if (typeof obj !== 'object' || obj === null) {
    if (typeof obj === 'string') {
      const { result, changed } = sanitizeString(obj);
      if (changed) {
        changes.push(`XSS content detected at ${path || 'root'}`);
      }
      return { result, changes };
    }
    return { result: obj, changes };
  }
  
  const result: Record<string, any> = Array.isArray(obj) ? [] : {};
  
  for (const key in obj) {
    const currentPath = path ? `${path}.${key}` : key;
    // Recursively sanitize each value
    const sanitizeResult = deepXssSanitize(obj[key], currentPath);
    result[key] = sanitizeResult.result;
    changes.push(...sanitizeResult.changes);
  }
  
  return { result, changes };
}

/**
 * Middleware to sanitize user input and protect against XSS attacks
 * Uses a deep sanitization approach for all request objects
 * 
 * @param {Request} req - Express request object
 * @param {Response} _res - Express response object (unused)
 * @param {NextFunction} next - Express next middleware function
 */
export const xssSanitizerMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const changes: string[] = [];
  
  // Sanitize request body
  if (req.body) {
    const sanitizeResult = deepXssSanitize(req.body, 'body');
    if (sanitizeResult.changes.length > 0) {
      changes.push(...sanitizeResult.changes);
      Object.keys(req.body).forEach(key => delete req.body[key]);
      Object.assign(req.body, sanitizeResult.result);
    }
  }
  
  // Sanitize query parameters without modifying the original
  if (req.query) {
    const sanitizeResult = deepXssSanitize(req.query, 'query');
    if (sanitizeResult.changes.length > 0) {
      changes.push(...sanitizeResult.changes);
    }
    req.sanitizedQuery = {
      ...req.sanitizedQuery,
      ...sanitizeResult.result
    };
  }
  
  // Sanitize route parameters
  if (req.params) {
    const sanitizeResult = deepXssSanitize(req.params, 'params');
    if (sanitizeResult.changes.length > 0) {
      changes.push(...sanitizeResult.changes);
      Object.keys(req.params).forEach(key => delete req.params[key]);
      Object.assign(req.params, sanitizeResult.result);
    }
  }
  
  // Log any detected attacks
  if (changes.length > 0) {
      logSecurityEvent("Potential NoSQL injection attempt", req, changes)
    }
  
  next();
}