import type { PlayerState } from "@/types/appStore.ts";
import NextSongCard from "@/components/player/NextSongCard.tsx";
import appStore from "@/store/appStore.ts";
import getOrCreateElement from "@/utils/dom/getOrCreateElement.ts";
import getOrCreateStyle from "@/utils/dom/getOrCreateStyle.ts";
import waitForElements from "@/utils/dom/waitForElements.ts";
import setupHoverToggle from "@/utils/setupHoverToggle.ts";
import React from "react";
import { createRoot, type Root } from "react-dom/client";

let playerElem: HTMLDivElement | null = null;
let hasResizeListener = false;
let nextCardRoot: Root | null = null;
let hoverTarget: null | ReturnType<typeof setupHoverToggle> = null;

export default function setPlayer(player = appStore.getState().player) {
  if (!playerElem) {
    waitForElements(".Root__now-playing-bar").then((elem) => {
      playerElem = elem as HTMLDivElement;
      setPlayer();
    });
    return;
  }

  applyPlayerClasses(player);
  applyDynamicStyles(player);
  setupPlayerHover(player);
  updatePlayerSize(player);

  if (!hasResizeListener) {
    window.addEventListener("resize", () => updatePlayerSize(player));
    hasResizeListener = true;
  }

  renderNextSongCard();
}

function applyPlayerClasses(player: PlayerState) {
  const { isFloating, autoHide, mode } = player;

  document.body.classList.toggle("player-compact", mode === "compact");
  document.body.classList.toggle("next-playing-on-left", player.nextSongCard.position === "left");
  document.body.classList.toggle("next-playing-on-right", player.nextSongCard.position === "right");
  document.body.classList.toggle("player-floating", isFloating);
  playerElem?.classList.toggle("floating", isFloating);
  document.body.classList.toggle("player-auto-hide", isFloating && autoHide);
}

function applyDynamicStyles(player: PlayerState) {
  const mode = player.mode;
  const style = player[mode === "compact" ? "compactStyle" : "defaultStyle"];
  const {
    height,
    width,
    paddingX,
    borderRadius,
    coverArtRadius,
    sliderHeight,
    bgColor,
    bgOpacity,
    backdropFilter,
  } = style;

  const styleElem = getOrCreateStyle("lucid-player-styles");

  styleElem.textContent = `
:root,
.Root__now-playing-bar {
  --player-height: ${height}px;
  --slider-height: ${sliderHeight}px;
  --player-width: ${width}%;
  --player-padding-x: ${paddingX}px;
  --player-border-radius: ${borderRadius}px;
  --player-image-radius: ${coverArtRadius}px;
  --player-bg-opacity: ${bgOpacity}%;
  --player-bg-color: ${bgColor || `rgba(var(--clr-surface-1-rgb), .7)`};
  --player-blur: ${backdropFilter.blur}px;
  --player-saturate: ${backdropFilter.saturation}%;
  --player-brightness: ${backdropFilter.brightness}%;
  --player-opacity: ${backdropFilter.opacity}%;
  --player-contrast: ${backdropFilter.contrast}%;
  --player-target-size: ${player.hoverTargetSize}px;
}`;
}

function setupPlayerHover(player: PlayerState) {
  const { isFloating, autoHide } = player;

  if (hoverTarget) {
    hoverTarget();
    hoverTarget = null;
  }
  if (isFloating && autoHide)
    hoverTarget = setupHoverToggle({
      onHoverBodyClass: "player--hovering",
      onNotHoverBodyClass: "player--not-hovering",
      containerSelector: ".Root__top-container",
      onTopContainerSelectors: [".Root__now-playing-bar", ".main-nowPlayingBar-container"],
      hoverTargetId: "player-hover-target",
      className: "show",
    });
}

function updatePlayerSize(player: PlayerState) {
  if (!playerElem) return;

  const currentWidth = playerElem.offsetWidth;
  document.body.style.setProperty("--player-width", `${currentWidth}px`);
  playerElem.style.setProperty("--width", `${currentWidth}px`);

  const { hideExtraIcon, mode } = player;
  const shouldHideIcons = (hideExtraIcon || currentWidth < 1000) && mode === "compact";
  playerElem.classList.toggle("hide-icons", shouldHideIcons);
}
function renderNextSongCard() {
  const show = appStore.getState().player.nextSongCard.show;

  if (!show) {
    if (nextCardRoot) {
      nextCardRoot.unmount();
      nextCardRoot = null;
    }
    return;
  }

  waitForElements(".main-nowPlayingBar-container").then((container) => {
    const rootElem = getOrCreateElement("div", "player-next-song-root", container);
    if (!nextCardRoot) nextCardRoot = createRoot(rootElem);

    nextCardRoot.render(<NextSongCard />);
  });
}

appStore.subscribe((state) => state.player, setPlayer);
