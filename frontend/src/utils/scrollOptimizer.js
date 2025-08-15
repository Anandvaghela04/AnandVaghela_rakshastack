/**
 * Scroll Performance Optimizer
 * Enhances scrolling performance across the application
 */

// Enable passive event listeners for better scroll performance
export const enablePassiveScrollListeners = () => {
  // Check if passive event listeners are supported
  let supportsPassive = false;
  
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
        return true;
      }
    });
    window.addEventListener('test', null, opts);
    window.removeEventListener('test', null, opts);
  } catch (e) {
    // Passive listeners not supported
  }

  // Optimize scroll performance
  const optimizeScroll = () => {
    // Use requestAnimationFrame for smooth scrolling
    let ticking = false;
    
    const updateScroll = () => {
      // Any scroll-based updates can go here
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };
    
    // Add passive scroll listener if supported
    if (supportsPassive) {
      window.addEventListener('scroll', requestTick, { passive: true });
    } else {
      window.addEventListener('scroll', requestTick);
    }
  };

  // Initialize scroll optimization
  optimizeScroll();
};

// Smooth scroll to element with performance optimization
export const smoothScrollTo = (element, offset = 0) => {
  if (!element) return;
  
  const targetPosition = element.offsetTop - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 800;
  let start = null;
  
  const animation = (currentTime) => {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };
  
  requestAnimationFrame(animation);
};

// Easing function for smooth scrolling
const easeInOutCubic = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t * t + b;
  t -= 2;
  return c / 2 * (t * t * t + 2) + b;
};

// Optimize scroll performance for specific containers
export const optimizeContainerScroll = (containerSelector) => {
  const containers = document.querySelectorAll(containerSelector);
  
  containers.forEach(container => {
    // Add CSS classes for performance optimization
    container.classList.add('scroll-container');
    
    // Enable smooth scrolling
    container.style.scrollBehavior = 'smooth';
    container.style.webkitOverflowScrolling = 'touch';
    
    // Hardware acceleration
    container.style.transform = 'translateZ(0)';
    container.style.backfaceVisibility = 'hidden';
  });
};

// Debounce scroll events for better performance
export const debounceScroll = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Initialize scroll optimizations
export const initScrollOptimizations = () => {
  // Enable passive scroll listeners
  enablePassiveScrollListeners();
  
  // Optimize scroll containers
  optimizeContainerScroll('.home, .hero-section, .featured-section, .features-section');
  
  // Add performance class to body
  document.body.classList.add('scroll-optimized');
  
  // Optimize scroll performance for mobile
  if ('ontouchstart' in window) {
    document.documentElement.style.webkitOverflowScrolling = 'touch';
    document.body.style.webkitOverflowScrolling = 'touch';
  }
};

// Export default initialization
export default initScrollOptimizations;