import Background from "@/components/background/Background.tsx";
import React from "react";
import { createRoot } from "react-dom/client";

const setBackground = (() => {
  let root: ReturnType<typeof createRoot> | null = null;

  return () => {
    const container = document.querySelector("#main") ?? document.body;
    if (!container || container.querySelector(".lucid-bg")) return;

    const bgDiv = Object.assign(document.createElement("div"), {
      className: "lucid-bg",
    });

    container.prepend(bgDiv);
    root = createRoot(bgDiv);
    root.render(<Background />);
  };
})();

export default setBackground;
