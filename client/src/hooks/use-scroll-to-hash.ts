import { useEffect, RefObject } from "react";

interface UseScrollToHashProps {
  containerRef: RefObject<HTMLElement>;
  sections: Array<{ slug: string }>;
}

export const useScrollToHash = ({
  containerRef,
  sections,
}: UseScrollToHashProps) => {
  useEffect(() => {
    if (sections.length === 0) return;

    const handlePopState = () => {
      const hash = window.location.hash.slice(1);
      const id = decodeURIComponent(hash || sections[0].slug);
      const element = document.getElementById(id);

      if (element && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scrollTop =
          elementRect.top - containerRect.top + containerRef.current.scrollTop;

        containerRef.current.scrollTo({
          top: scrollTop,
        });
      }
    };

    window.addEventListener("popstate", handlePopState);
    handlePopState();

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [sections, containerRef]);
};
