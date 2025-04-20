import { useQuery } from "@tanstack/react-query";
import { EXCEL_TEMPLATE_ROUTES } from "../../../../../../../constants/routes/settings/excel-template-configuration/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { excelTemplateKeys } from "../../../../../../../queryKeysFactories/excelTemplate";

type GetGenerateExcelArgs = {
  excelTemplateId: string;
};

export function useGetGenerateExcel({ excelTemplateId }: GetGenerateExcelArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const useGetGenerateExcel = async () => {
    const { data } = await axiosPrivate.get<ArrayBuffer>(
      EXCEL_TEMPLATE_ROUTES.generateExcel(excelTemplateId),
      { responseType: "arraybuffer" }
    );

    return data;
  };

  return useQuery({
    queryKey: excelTemplateKeys.generateExcel(excelTemplateId),
    queryFn: useGetGenerateExcel,
    enabled: !!excelTemplateId,
  });
}
