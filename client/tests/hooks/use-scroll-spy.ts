import { useEffect, RefObject, DependencyList } from "react";

interface UseScrollSpyProps<T> {
  /**
   * The ref of the outer (scrollable) container that contains the sections to spy on.
   */
  containerRef: RefObject<HTMLElement>;
  /**
   * The function to set the current step.
   */
  setCurrentStep: (value: T) => void;
  /**
   * The options for the IntersectionObserver.
   */
  options?: {
    threshold?: number;
    rootMargin?: string;
  };
  /**
   * The dependencies to watch for changes.
   */
  deps?: DependencyList;
}

export function useScrollSpy<T>({
  containerRef,
  setCurrentStep,
  options = {},
  deps = [],
}: UseScrollSpyProps<T>) {
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionSlug = entry.target.id as T;
            setCurrentStep(sectionSlug);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: options.threshold,
        rootMargin: options.rootMargin,
      },
    );

    const sections = Array.from(containerRef.current.children);
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [
    containerRef,
    setCurrentStep,
    options.threshold,
    options.rootMargin,
    deps,
  ]);
}
