"use client";
import { useRef, useEffect, PropsWithChildren, useState } from "react";

import { useRouter } from "next/navigation";

import { Section as SectionEntity } from "@shared/dto/sections/section.entity";
import { useSetAtom } from "jotai";

import { intersectingAtom } from "@/containers/explore/store";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SectionProps {
  data: SectionEntity;
  menuItems: SectionEntity[];
}

const POPOVER_ID = "sections-menu-popover";
const Section: React.FC<PropsWithChildren<SectionProps>> = ({
  data,
  menuItems,
  children,
}) => {
  const { slug, name, description } = data;
  const ref = useRef<HTMLDivElement>(null);
  const setIntersecting = useSetAtom(intersectingAtom);
  const [popoverOpen, setPopOverOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const { top, bottom } = entry.boundingClientRect;
        const isInViewport = top >= 0 && bottom <= window.innerHeight;

        if (isInViewport) {
          setIntersecting(slug);
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

  const handleLinkClick = (sectionId: string) => {
    setPopOverOpen(false);

    // Scroll to anchor tag only works properly after popup is removed from the DOM:
    const checkPopoverRemoved = () => {
      if (!document.getElementById(POPOVER_ID)) {
        router.push(`#${sectionId}`);
      } else {
        requestAnimationFrame(checkPopoverRemoved);
      }
    };

    requestAnimationFrame(checkPopoverRemoved);
  };

  return (
    <section
      className="h-[660px]"
      ref={ref}
      id={slug}
      data-testid="section-container"
    >
      <header className="flex justify-between space-y-4 rounded-2xl bg-secondary p-6">
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p>{description}</p>
        </div>
        <Popover open={popoverOpen} onOpenChange={setPopOverOpen}>
          <PopoverTrigger asChild id="section-nav">
            <Button type="button" variant="default" className="p-0">
              <div className="flex items-center justify-center">
                <svg
                  className="h-8 w-8"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    className="fill-white hover:fill-slate-200"
                    width="32"
                    height="32"
                    rx="16"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.1336 9.60001C10.1336 9.89456 9.89478 10.1333 9.60023 10.1333C9.30568 10.1333 9.06689 9.89456 9.06689 9.60001C9.06689 9.30546 9.30568 9.06668 9.60023 9.06668C9.89478 9.06668 10.1336 9.30546 10.1336 9.60001ZM10.1336 13.3333V18.6667H21.8669V13.3333H10.1336ZM10.1336 12.2667C9.54446 12.2667 9.06689 12.7442 9.06689 13.3333V18.6667C9.06689 19.2558 9.54446 19.7333 10.1336 19.7333H21.8669C22.456 19.7333 22.9336 19.2558 22.9336 18.6667V13.3333C22.9336 12.7442 22.456 12.2667 21.8669 12.2667H10.1336ZM9.60023 22.9333C9.89478 22.9333 10.1336 22.6945 10.1336 22.4C10.1336 22.1055 9.89478 21.8667 9.60023 21.8667C9.30568 21.8667 9.06689 22.1055 9.06689 22.4C9.06689 22.6945 9.30568 22.9333 9.60023 22.9333ZM12.2669 9.60001C12.2669 9.89456 12.0281 10.1333 11.7336 10.1333C11.439 10.1333 11.2002 9.89456 11.2002 9.60001C11.2002 9.30546 11.439 9.06668 11.7336 9.06668C12.0281 9.06668 12.2669 9.30546 12.2669 9.60001ZM11.7336 22.9333C12.0281 22.9333 12.2669 22.6945 12.2669 22.4C12.2669 22.1055 12.0281 21.8667 11.7336 21.8667C11.439 21.8667 11.2002 22.1055 11.2002 22.4C11.2002 22.6945 11.439 22.9333 11.7336 22.9333ZM14.4002 9.60001C14.4002 9.89456 14.1614 10.1333 13.8669 10.1333C13.5723 10.1333 13.3336 9.89456 13.3336 9.60001C13.3336 9.30546 13.5723 9.06668 13.8669 9.06668C14.1614 9.06668 14.4002 9.30546 14.4002 9.60001ZM13.8669 22.9333C14.1614 22.9333 14.4002 22.6945 14.4002 22.4C14.4002 22.1055 14.1614 21.8667 13.8669 21.8667C13.5723 21.8667 13.3336 22.1055 13.3336 22.4C13.3336 22.6945 13.5723 22.9333 13.8669 22.9333ZM16.5336 9.60001C16.5336 9.89456 16.2948 10.1333 16.0002 10.1333C15.7057 10.1333 15.4669 9.89456 15.4669 9.60001C15.4669 9.30546 15.7057 9.06668 16.0002 9.06668C16.2948 9.06668 16.5336 9.30546 16.5336 9.60001ZM16.0002 22.9333C16.2948 22.9333 16.5336 22.6945 16.5336 22.4C16.5336 22.1055 16.2948 21.8667 16.0002 21.8667C15.7057 21.8667 15.4669 22.1055 15.4669 22.4C15.4669 22.6945 15.7057 22.9333 16.0002 22.9333ZM18.6669 9.60001C18.6669 9.89456 18.4281 10.1333 18.1336 10.1333C17.839 10.1333 17.6002 9.89456 17.6002 9.60001C17.6002 9.30546 17.839 9.06668 18.1336 9.06668C18.4281 9.06668 18.6669 9.30546 18.6669 9.60001ZM18.1336 22.9333C18.4281 22.9333 18.6669 22.6945 18.6669 22.4C18.6669 22.1055 18.4281 21.8667 18.1336 21.8667C17.839 21.8667 17.6002 22.1055 17.6002 22.4C17.6002 22.6945 17.839 22.9333 18.1336 22.9333ZM20.8002 9.60001C20.8002 9.89456 20.5614 10.1333 20.2669 10.1333C19.9724 10.1333 19.7336 9.89456 19.7336 9.60001C19.7336 9.30546 19.9724 9.06668 20.2669 9.06668C20.5614 9.06668 20.8002 9.30546 20.8002 9.60001ZM20.2669 22.9333C20.5614 22.9333 20.8002 22.6945 20.8002 22.4C20.8002 22.1055 20.5614 21.8667 20.2669 21.8667C19.9724 21.8667 19.7336 22.1055 19.7336 22.4C19.7336 22.6945 19.9724 22.9333 20.2669 22.9333ZM22.9336 9.60001C22.9336 9.89456 22.6947 10.1333 22.4002 10.1333C22.1057 10.1333 21.8669 9.89456 21.8669 9.60001C21.8669 9.30546 22.1057 9.06668 22.4002 9.06668C22.6947 9.06668 22.9336 9.30546 22.9336 9.60001ZM22.4002 22.9333C22.6947 22.9333 22.9336 22.6945 22.9336 22.4C22.9336 22.1055 22.6947 21.8667 22.4002 21.8667C22.1057 21.8667 21.8669 22.1055 21.8669 22.4C21.8669 22.6945 22.1057 22.9333 22.4002 22.9333Z"
                    fill="#3048B5"
                  />
                </svg>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" id={POPOVER_ID}>
            {menuItems.map((s) => (
              <Button
                key={`menu-item-${s.slug}`}
                variant="clean"
                className="block w-full p-4 text-left text-xs hover:bg-primary-foreground"
                onClick={() => {
                  handleLinkClick(s.slug);
                }}
              >
                {s.name}
              </Button>
            ))}
          </PopoverContent>
        </Popover>
      </header>
      {children}
    </section>
  );
};

export default Section;
