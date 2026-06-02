/**
 * Application-wide constants
 */

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export const CACHE_DURATIONS = {
  METRICS: 30 * 1000, // 30 seconds
  BOOKINGS: 60 * 1000, // 1 minute
  ROOMS: 60 * 1000, // 1 minute
} as const

export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch data. Please try again.',
  INVALID_DATA: 'Received invalid data from server.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
} as const

export const API_ROUTES = {
  METRICS: '/api/metrics-json',
  BOOKINGS: '/api/bookings',
  ROOMS: '/api/rooms',
} as const
