import { showNotification } from "@/utils/showNotification.tsx";
export async function copyToClipboard(
  text: string,
  message = "Text copied to clipboard!",
): Promise<void> {
  const id = "clipboard-notify";
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      showNotification({ message, id });
    } catch (err) {
      console.error("Error copying to clipboard:", err);
      showNotification({
        message: `Error copying to clipboard: ${err instanceof Error ? err.message : err}`,
        isError: true,
        id,
      });
    }
  } else {
    console.error("[Lucid] Error: copying text (navigator.clipboard not found)");
    showNotification({ id, message: "Error copying text", isError: true });
  }
}
