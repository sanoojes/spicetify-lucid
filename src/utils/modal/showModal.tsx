import Modal from "@/components/Modal.tsx";
import getOrCreateElement from "@/utils/dom/getOrCreateElement.ts";
import React, { type ReactNode } from "react";
import { createRoot } from "react-dom/client";

type ModalProps = {
  title: string;
  content: ReactNode;
};

export function showModal({ title, content }: ModalProps) {
  const rootElem = getOrCreateElement("div", "modal-root", document.body);
  const root = createRoot(rootElem);

  const handleClose = () => {
    root.unmount();
    if (rootElem.parentNode) {
      rootElem.parentNode.removeChild(rootElem);
    }
  };

  root.render(
    <Modal title={title} onClose={handleClose} isOpen>
      {content}
    </Modal>,
  );
}
