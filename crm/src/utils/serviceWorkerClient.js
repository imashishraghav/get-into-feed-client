/**
 * Client lifecycle utilities for FeedOS Service Worker:
 * - Registers /sw.js for static shell assets only.
 * - Detects installed waiting workers and triggers update prompt callback.
 * - Wipes all PWA caches cleanly on user logout / session switch.
 */

/**
 * Registers /sw.js and notifies `onUpdateAvailable` when a new worker awaits activation.
 *
 * @param {(applyUpdate: () => void) => void} [onUpdateAvailable]
 * @returns {Promise<ServiceWorkerRegistration | null>}
 */
export async function registerFeedOsServiceWorker(onUpdateAvailable) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

    const notifyWaiting = (worker) => {
      if (!worker || typeof onUpdateAvailable !== 'function') return;
      onUpdateAvailable(() => {
        worker.postMessage({ type: 'SKIP_WAITING' });
      });
    };

    if (registration.waiting && navigator.serviceWorker.controller) {
      notifyWaiting(registration.waiting);
    }

    registration.addEventListener('updatefound', () => {
      const installing = registration.installing;
      if (!installing) return;
      installing.addEventListener('statechange', () => {
        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
          notifyWaiting(installing);
        }
      });
    });

    return registration;
  } catch {
    return null;
  }
}

/**
 * Instructs the active service worker to wipe all shell caches (must be called on logout).
 * Also clears window CacheStorage directly as defense in depth.
 *
 * @returns {Promise<void>}
 */
export async function clearServiceWorkerCaches() {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHES' });
  }

  if ('caches' in window) {
    try {
      const keys = await window.caches.keys();
      await Promise.all(keys.map((key) => window.caches.delete(key)));
    } catch {
      // Non-fatal in sandboxed contexts
    }
  }
}
