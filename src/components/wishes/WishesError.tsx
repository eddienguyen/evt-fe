/**
 * WishesError Component
 * 
 * Error state display with retry functionality for wishes loading failures.
 * Provides user-friendly error messages and recovery options.
 * 
 * @module components/wishes/WishesError
 */

export interface WishesErrorProps {
  /** Error message to display */
  readonly message?: string
  /** Retry function */
  readonly onRetry?: () => void
  /** Additional CSS classes */
  readonly className?: string
  /** Show retry button */
  readonly showRetry?: boolean
  /** Retry button loading state */
  readonly isRetrying?: boolean
}

/**
 * WishesError Component
 * 
 * Displays error state with optional retry functionality.
 * Provides clear messaging and recovery actions.
 * 
 * @param props - Component props
 * @returns Error state component
 * 
 * @example
 * ```tsx
 * <WishesError 
 *   message="Failed to load wishes"
 *   onRetry={() => refetch()}
 *   isRetrying={isLoading}
 * />
 * ```
 */
export function WishesError({
  message = 'Unable to load wishes at this time',
  onRetry,
  className = '',
  showRetry = true,
  isRetrying = false
}: WishesErrorProps) {
  return (
    <div className={`
      text-center py-12
      ${className}
    `.trim()}>
      <div className="max-w-md mx-auto">
        {/* Error Icon */}
        <div className="mb-4">
          <svg 
            className="mx-auto h-12 w-12 text-red-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5}
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Something went wrong
        </h3>
        
        <p className="text-sm text-gray-600 mb-6">
          {message}
        </p>

        {/* Retry Button */}
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="
              inline-flex items-center justify-center
              px-4 py-2
              text-sm font-medium
              text-white bg-blue-600
              border border-transparent
              rounded-lg
              shadow-sm
              hover:bg-blue-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            "
            aria-label={isRetrying ? 'Retrying...' : 'Retry loading wishes'}
          >
            {isRetrying ? (
              <>
                {/* Loading Spinner */}
                <svg 
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Retrying...
              </>
            ) : (
              <>
                {/* Retry Icon */}
                <svg 
                  className="-ml-1 mr-2 h-4 w-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try again
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default WishesError