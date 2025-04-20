"use client";

import { useSearchParams } from "next/navigation";
import { EditExcelTemplateConfiguration } from "../../../../../components/settings/BulkDataManagement/ExcelTemplateConfiguration/EditExcelTemplateConfiguration";
import { ViewExcelTemplateConfiguration } from "../../../../../components/settings/BulkDataManagement/ExcelTemplateConfiguration/ViewExcelTemplateConfiguration";

export type PageProps = Readonly<{
  params: {
    excelTemplateId: string;
    page?: string;
  };
}>;

export default function Page({ params }: PageProps) {
  const searchParams = useSearchParams();

  const page = searchParams.get("page");

  const { excelTemplateId } = params;

  if (excelTemplateId && page === "edit-page") {
    return <EditExcelTemplateConfiguration excelTemplateId={excelTemplateId} />;
  } else if (excelTemplateId && page === "view-page") {
    return <ViewExcelTemplateConfiguration excelTemplateId={excelTemplateId} />;
  }
}
