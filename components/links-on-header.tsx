"use client";

import { UseDates } from "@/hooks/use-dates";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import NavigationLinks from "./navigation-links";

function LinkOnHeader({ session }) {
  const { currentMonthName, currentYear } = UseDates();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const linkRefs = useRef([]);

  const isHomePage = pathname === "/";
  let month =
    searchParams.get("periodo") || `${currentMonthName}-${currentYear}`;

  // Garante que o hook será executado, mesmo que o componente não tenha links.
  const links =
    session && !isHomePage
      ? NavigationLinks({
          month,
          userEmail: session.email,
        })
      : [];

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = linkRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const activeIndex = links.findIndex(({ path }) => path === pathname);
      if (activeIndex !== -1 && linkRefs.current[activeIndex]) {
        const { offsetLeft, offsetWidth } = linkRefs.current[activeIndex];
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, [pathname, links]);

  if (!session || isHomePage) return null;

  return (
    <nav className="hidden md:block">
      <div className="flex w-full items-center justify-center">
        <div className="relative">
          {/* Hover Highlight */}
          <div
            className="absolute bottom-0 border border-color-2 transition-all duration-300 ease-out dark:bg-neutral-800"
            style={{
              ...hoverStyle,
              opacity: hoveredIndex !== null ? 1 : 0,
            }}
          />

          {/* Active Indicator */}
          <div
            className="absolute bottom-0 border border-color-6 transition-all duration-300 ease-out dark:bg-white"
            style={activeStyle}
          />

          {/* Navigation Links */}
          <div className="relative flex space-x-1">
            <Suspense>
              {links.map(({ href, Icon, name, path }, index) => (
                <Link key={href} href={href}>
                  <div
                    ref={(el) => (linkRefs.current[index] = el)}
                    className="px-4 py-2"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div
                      className={`flex items-center gap-1 transition-colors duration-200 ${
                        pathname === path
                          ? "text-color-6 dark:text-white"
                          : "text-color-2 hover:text-color-2 dark:text-neutral-300"
                      }`}
                    >
                      <Icon size={14} />
                      <span className="lowercase">{name}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default LinkOnHeader;
