import UnderMainView from "@/components/UnderMainView.tsx";
import React from "react";
import { createRoot } from "react-dom/client";

const setUnderMainView = (() => {
  let root: ReturnType<typeof createRoot> | null = null;

  return () => {
    const container =
      document.querySelector(".under-main-view")?.parentElement ||
      document.querySelector(".main-view-container");
    if (!container || container.querySelector(".umv-root")) return;

    const umvDiv = Object.assign(document.createElement("div"), {
      className: "umv-root",
    });

    container.prepend(umvDiv);
    root = createRoot(umvDiv);
    root.render(<UnderMainView />);
  };
})();

export default setUnderMainView;
