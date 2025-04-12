/**
 * Responsive design utility functions and constants
 */

// Standard breakpoints for responsive design
export const breakpoints = {
  sm: 640,  // Small devices (phones)
  md: 768,  // Medium devices (tablets)
  lg: 1024, // Large devices (laptops)
  xl: 1280, // Extra large devices (desktops)
  '2xl': 1536, // Extra extra large devices
};

/**
 * Custom hook to determine if the device is mobile
 * @param {number} breakpoint - The breakpoint to check against (default: md)
 * @returns {boolean} - Whether the screen is smaller than the breakpoint
 */
export const useIsMobile = (breakpoint = 'md') => {
  if (typeof window === 'undefined') return false;
  
  return window.innerWidth < breakpoints[breakpoint];
};

/**
 * Get responsive class names based on device size
 * @param {object} options - Options for responsive classes
 * @param {string} options.base - Base classes for all screen sizes
 * @param {string} options.sm - Classes for small screens and up
 * @param {string} options.md - Classes for medium screens and up
 * @param {string} options.lg - Classes for large screens and up
 * @param {string} options.xl - Classes for extra large screens and up
 * @returns {string} - Combined class names for responsive design
 */
export const getResponsiveClasses = ({ base = '', sm = '', md = '', lg = '', xl = '' }) => {
  return `${base} ${sm} ${md} ${lg} ${xl}`.trim();
};

/**
 * Helper function to create responsive grid layouts
 * @param {object} options - Grid options
 * @param {number} options.sm - Columns for small screens (default: 1)
 * @param {number} options.md - Columns for medium screens (default: 2)
 * @param {number} options.lg - Columns for large screens (default: 3)
 * @param {number} options.xl - Columns for extra large screens (default: 4)
 * @param {string} options.gap - Gap between grid items (default: '1rem')
 * @returns {string} - CSS classes for responsive grid
 */
export const responsiveGrid = ({ 
  sm = 1, 
  md = 2, 
  lg = 3, 
  xl = 4, 
  gap = '1rem' 
}) => {
  return `grid grid-cols-${sm} sm:grid-cols-${md} md:grid-cols-${lg} lg:grid-cols-${xl} gap-${gap}`;
};
