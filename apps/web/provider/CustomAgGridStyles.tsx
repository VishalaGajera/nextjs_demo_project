import { useEffect } from "react";

export const CustomAgGridStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");

    style.innerHTML = `
        .ag-root-wrapper-body.ag-layout-normal {
          height: auto !important;
        },
      `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};
