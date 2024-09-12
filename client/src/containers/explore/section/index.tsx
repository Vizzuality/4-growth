"use client";
import { useRef, useEffect, PropsWithChildren } from "react";

import { useSetAtom } from "jotai";

import { intersectingAtom } from "@/containers/explore/store";

interface SectionProps {
  id: string;
}

const Section: React.FC<PropsWithChildren<SectionProps>> = ({
  id,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const setIntersecting = useSetAtom(intersectingAtom);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const { top, bottom } = entry.boundingClientRect;
        const isInViewport = top >= 0 && bottom <= window.innerHeight;

        if (isInViewport) {
          setIntersecting(id);
        }
      },
      { threshold: 1.0 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} id={id}>
      {children}
    </div>
  );
};

export default Section;
