import { useRouter } from "next/navigation";
import { type MouseEvent } from "react";

export const useNavigateToRoute = () => {
  const router = useRouter();

  const navigateToNewPage = (e: MouseEvent<HTMLSpanElement>, url: string) => {
    if (e.ctrlKey || e.button === 1) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      router.push(url);
    }
  };

  return navigateToNewPage;
};
