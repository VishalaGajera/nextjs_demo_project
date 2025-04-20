import { useQuery } from "@tanstack/react-query";
import { EXCEL_TEMPLATE_ROUTES } from "../../../../../../../constants/routes/settings/excel-template-configuration/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { excelTemplateKeys } from "../../../../../../../queryKeysFactories/excelTemplate";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";

type GetAllExcelTemplateFieldsProps = {
  excelTemplateId: string;
};

export type DataType = "string" | "number" | "boolean";

export type FieldType =
  | "auto_complete"
  | "text_field"
  | "date_picker"
  | "check_box"
  | "phone_input_field";

export type ExcelTemplateFields = {
  id: string;
  template_field_name: string;
  excel_master_field_id: string;
  field_name: string;
  db_field_name: string;
  field_type: FieldType;
  data_type: DataType;
  description: string;
  sample_data: string;
  required: true;
};

export function useGetAllExcelTemplateFieldsQueryFn({
  excelTemplateId,
}: GetAllExcelTemplateFieldsProps) {
  const { axiosPrivate } = useAxiosPrivate();

  const getAllExcelTemplateFields = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<ExcelTemplateFields[]>
    >(EXCEL_TEMPLATE_ROUTES.getAllFields(excelTemplateId));

    return data.data;
  };

  return { getAllExcelTemplateFields };
}
export function useGetAllExcelTemplateFields({
  excelTemplateId,
}: GetAllExcelTemplateFieldsProps) {
  const { getAllExcelTemplateFields } = useGetAllExcelTemplateFieldsQueryFn({
    excelTemplateId,
  });

  return useQuery({
    queryKey: excelTemplateKeys.getAllFields(excelTemplateId),
    queryFn: getAllExcelTemplateFields,
    enabled: !!excelTemplateId,
    initialData: [],
  });
}
