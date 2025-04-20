import { saveAs } from "file-saver";
import JSZip from "jszip";

const getExtensionFromContentType = (contentType: string): string | null => {
  const map: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  };

  return map[contentType] ?? null;
};

export const downloadZip = async (data: string[], fileName: string) => {
  const zip = new JSZip();

  for (const [index, url] of data.entries()) {
    const response = await fetch(url);

    const blob = await response.blob();

    const contentType = response.headers.get("Content-Type") ?? "";

    const extension = getExtensionFromContentType(contentType) ?? "bin";

    zip.file(`file_${index + 1}.${extension}`, blob);
  }

  const content = await zip.generateAsync({ type: "blob" });

  saveAs(content, `${fileName}.zip`);
};
