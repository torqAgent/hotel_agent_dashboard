'use client'
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Dashboard error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center h-screen bg-dark text-white">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
              <p className="text-gray-400 mb-4">{this.state.error?.message || 'An unexpected error occurred'}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gold hover:bg-gold-dim text-dark rounded-lg font-medium transition-colors"
              >
                Reload page
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
