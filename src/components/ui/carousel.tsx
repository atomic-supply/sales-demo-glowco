/** @jsxImportSource @emotion/react */
"use client";

import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";
import { Button } from "./button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const carouselRootStyles = css`
  position: relative;
`;

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & CarouselProps & { css?: Interpolation<Theme> }) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        css={[carouselRootStyles, cssProp]}
        className={className}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

const carouselContentWrapperStyles = css`
  overflow: hidden;
`;

const carouselContentStyles = css`
  display: flex;

  &[data-orientation="horizontal"] {
    margin-left: -1rem;
  }

  &[data-orientation="vertical"] {
    margin-top: -1rem;
    flex-direction: column;
  }
`;

function CarouselContent({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} css={carouselContentWrapperStyles} data-slot="carousel-content">
      <div
        css={[carouselContentStyles, cssProp]}
        data-orientation={orientation}
        className={className}
        {...props}
      />
    </div>
  );
}

const carouselItemStyles = css`
  min-width: 0;
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: 100%;

  &[data-orientation="horizontal"] {
    padding-left: 1rem;
  }

  &[data-orientation="vertical"] {
    padding-top: 1rem;
  }
`;

function CarouselItem({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      css={[carouselItemStyles, cssProp]}
      data-orientation={orientation}
      className={className}
      {...props}
    />
  );
}

const carouselButtonStyles = css`
  position: absolute;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;

  &[data-orientation="horizontal"] {
    top: 50%;
    transform: translateY(-50%);
  }

  &[data-orientation="vertical"] {
    left: 50%;
    transform: translateX(-50%) rotate(90deg);
  }
`;

const carouselPreviousStyles = css`
  &[data-orientation="horizontal"] {
    left: -3rem;
  }

  &[data-orientation="vertical"] {
    top: -3rem;
  }
`;

const carouselNextStyles = css`
  &[data-orientation="horizontal"] {
    right: -3rem;
  }

  &[data-orientation="vertical"] {
    bottom: -3rem;
  }
`;

const srOnlyStyles = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  css: cssProp,
  ...props
}: React.ComponentProps<typeof Button> & { css?: Interpolation<Theme> }) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      css={[carouselButtonStyles, carouselPreviousStyles, cssProp]}
      data-orientation={orientation}
      className={className}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span css={srOnlyStyles}>Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  css: cssProp,
  ...props
}: React.ComponentProps<typeof Button> & { css?: Interpolation<Theme> }) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      css={[carouselButtonStyles, carouselNextStyles, cssProp]}
      data-orientation={orientation}
      className={className}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span css={srOnlyStyles}>Next slide</span>
    </Button>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
};
