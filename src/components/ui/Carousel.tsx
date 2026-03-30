import UI from "@/components/ui";
import { ChevronLeft16Filled, ChevronRight16Filled } from "@fluentui/react-icons";
import { useEffect, useRef, useState } from "react";

type CarouselProps = {
  categories: string[];
  defaultIndex?: number;
  onCategorySelect?: (label: string, index: number) => void;
  scrollAmount?: number;
};

const Carousel = ({
  categories,
  defaultIndex = 0,
  onCategorySelect,

  scrollAmount,
}: CarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    setSelectedIndex(defaultIndex);
  }, [defaultIndex]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (el) {
      const amount = scrollAmount ?? el.offsetWidth / 2;
      el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  const checkScrollPosition = () => {
    const el = scrollRef.current;
    if (el) {
      setAtStart(el.scrollLeft <= 0);
      setAtEnd(Math.ceil(el.scrollLeft + el.offsetWidth) >= el.scrollWidth);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => checkScrollPosition();

    checkScrollPosition();

    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [categories]);

  const handleCategoryClick = (index: number) => {
    setSelectedIndex(index);
    onCategorySelect?.(categories[index], index);
  };

  return (
    <div className="search-searchCategory-wrapper carousel-wrapper">
      <div
        className={`search-searchCategory-contentArea a2NTH51fJWzWsds0OYv_ ${atStart ? "at-start U8wi3gXSb248Imbxy4gc" : ""} ${atEnd ? "at-end Yjx8QrpjqgjqQPj4KWCh" : ""}`}
      >
        <div
          className="search-searchCategory-categoryGrid"
          style={{ userSelect: "none", scrollBehavior: "auto" }}
          ref={scrollRef}
        >
          {categories.map((label, index) => (
            <div key={label} className="search-searchCategory-categoryGridItem">
              <UI.Button
                variant={selectedIndex === index ? "primary" : "default"}
                onClick={() => handleCategoryClick(index)}
              >
                {label}
              </UI.Button>
            </div>
          ))}
        </div>
      </div>
      <div className="search-searchCategory-carousel">
        <UI.Button
          variant="icon-no-border"
          className={`${atStart ? "hide" : "show"}`}
          onClick={() => scroll("left")}
        >
          <ChevronLeft16Filled className="e-9890-icon e-9890-baseline" />
        </UI.Button>

        <UI.Button
          variant="icon-no-border"
          className={`${atEnd ? "hide" : "show"}`}
          onClick={() => scroll("right")}
        >
          <ChevronRight16Filled className="e-9890-icon e-9890-baseline" />
        </UI.Button>
      </div>
    </div>
  );
};

export default Carousel;
