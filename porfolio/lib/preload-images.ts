function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload: ${src}`));
    img.src = src;
  });
}

/**
 * Preloads image URLs into the browser cache before rendering a gallery.
 * Failed URLs are skipped so one broken asset does not block the page.
 */
export async function preloadImages(
  sources: string[],
  options?: {
    concurrency?: number;
    onProgress?: (loaded: number, total: number) => void;
  }
): Promise<{ loaded: number; failed: number; total: number }> {
  const unique = [...new Set(sources.filter(Boolean))];
  const total = unique.length;

  if (total === 0) {
    options?.onProgress?.(0, 0);
    return { loaded: 0, failed: 0, total: 0 };
  }

  const concurrency = Math.max(1, options?.concurrency ?? 6);
  let nextIndex = 0;
  let loaded = 0;
  let failed = 0;

  const worker = async () => {
    while (nextIndex < total) {
      const current = nextIndex++;
      const src = unique[current];
      try {
        await preloadImage(src);
        loaded += 1;
      } catch {
        failed += 1;
      }
      options?.onProgress?.(loaded + failed, total);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, total) }, () => worker())
  );

  return { loaded, failed, total };
}
