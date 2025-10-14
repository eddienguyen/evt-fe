import React from 'react'
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

const ErrorBoundary: React.FC = () => {
  const error = useRouteError()
  
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-8">Page not found</p>
            <a href="/" className="text-primary hover:underline">
              Return to home
            </a>
          </div>
        </main>
      )
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-xl mb-8">Something went wrong</p>
        <a href="/" className="text-primary hover:underline">
          Return to home
        </a>
      </div>
    </main>
  )
}

export default ErrorBoundary