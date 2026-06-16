"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CarouselState = Readonly<{
  activeDotIndex: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
}>;

type UseHorizontalCarouselOptions = Readonly<{
  fallbackStep: number;
  itemCount?: number;
  itemGap?: number;
  itemSelector?: string;
}>;

function getMaxScrollLeft(container: HTMLElement) {
  return Math.max(container.scrollWidth - container.clientWidth, 0);
}

function getScrollStep(
  container: HTMLElement,
  { fallbackStep, itemGap = 16, itemSelector }: UseHorizontalCarouselOptions,
) {
  const item = itemSelector
    ? container.querySelector<HTMLElement>(itemSelector)
    : null;

  return item ? item.getBoundingClientRect().width + itemGap : fallbackStep;
}

export function useHorizontalCarousel<TElement extends HTMLElement>({
  fallbackStep,
  itemCount,
  itemGap = 16,
  itemSelector,
}: UseHorizontalCarouselOptions) {
  const scrollRef = useRef<TElement | null>(null);
  const [state, setState] = useState<CarouselState>({
    activeDotIndex: 0,
    canGoNext: true,
    canGoPrevious: false,
  });

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const maxScrollLeft = getMaxScrollLeft(container);
    const activeDotIndex =
      itemCount && itemCount > 1 && maxScrollLeft > 0
        ? Math.min(
            Math.round((container.scrollLeft / maxScrollLeft) * (itemCount - 1)),
            itemCount - 1,
          )
        : 0;

    setState({
      activeDotIndex,
      canGoNext: container.scrollLeft < maxScrollLeft - 1,
      canGoPrevious: container.scrollLeft > 1,
    });
  }, [itemCount]);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scroll = useCallback(
    (direction: "next" | "previous") => {
      const container = scrollRef.current;

      if (!container) {
        return;
      }

      const step = getScrollStep(container, {
        fallbackStep,
        itemGap,
        itemSelector,
      });
      const maxScrollLeft = getMaxScrollLeft(container);
      const nextScrollLeft =
        direction === "next"
          ? Math.min(container.scrollLeft + step, maxScrollLeft)
          : Math.max(container.scrollLeft - step, 0);

      container.scrollTo({ behavior: "smooth", left: nextScrollLeft });
    },
    [fallbackStep, itemGap, itemSelector],
  );

  const scrollNext = useCallback(() => {
    scroll("next");
  }, [scroll]);

  const scrollPrevious = useCallback(() => {
    scroll("previous");
  }, [scroll]);

  return {
    ...state,
    scrollNext,
    scrollPrevious,
    scrollRef,
    updateScrollState,
  };
}
