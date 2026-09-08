import Modal from "@/components/Modal.tsx";
import getOrCreateElement from "@/utils/dom/getOrCreateElement.ts";
import React, { type ReactNode } from "react";
import { createRoot } from "react-dom/client";

type ModalProps = {
  id: string;
  title: string;
  content: ReactNode;
};

const activeModals = new Set<string>();

export function showModal({ id, title, content }: ModalProps) {
  if (activeModals.has(id)) {
    return;
  }
  activeModals.add(id);

  const modalRoot = getOrCreateElement("div", "modal-root", document.body);
  const container = document.createElement("div");
  modalRoot.appendChild(container);

  const root = createRoot(container);

  const handleClose = () => {
    activeModals.delete(id);
    root.unmount();
    container.remove();
  };

  root.render(
    <Modal title={title} onClose={handleClose} isOpen>
      {content}
    </Modal>,
  );
}
