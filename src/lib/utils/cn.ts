/**
 * Class Name Utility
 * 
 * Utility function for conditionally joining classNames together.
 * Similar to `clsx` or `classnames` libraries but lightweight.
 * 
 * @module lib/utils
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[]

/**
 * Conditionally join class names
 * 
 * @param classes - Class values to join
 * @returns Joined class string
 * 
 * @example
 * ```ts
 * cn('foo', 'bar') // 'foo bar'
 * cn('foo', condition && 'bar') // 'foo bar' or 'foo'
 * cn(['foo', 'bar'], 'baz') // 'foo bar baz'
 * ```
 */
export function cn(...classes: ClassValue[]): string {
  return classes
    .flat()
    .filter((x) => typeof x === 'string')
    .join(' ')
    .trim()
}
