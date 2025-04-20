import {
  Breadcrumbs,
  Button,
  Card,
  FormContainer,
  FormSection,
  SvgsHome,
  toasts,
} from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { onError } from "../../../../utils/errors";
import { EditAction } from "../../../common/EditAction";
import {
  type FormRef,
  ExcelTemplateConfigurationForm,
} from "./ExcelTemplateConfigurationForm";
import type { ExcelConfigurationPayload } from "./hooks/useAddExcelTemplateConfiguration";
import { useEditExcelTemplateConfiguration } from "./hooks/useEditExcelTemplateConfiguration";
import { useGetExcelTemplate } from "./hooks/useGetExcelTemplate";

type EditExcelTemplateConfigurationProps = Readonly<{
  excelTemplateId: string;
}>;

export function EditExcelTemplateConfiguration({
  excelTemplateId,
}: EditExcelTemplateConfigurationProps) {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { data: excelTemplateDetail, isPending: isPendingLatestExcelTemplate } =
    useGetExcelTemplate({
      excelTemplateId,
    });

  const { mutate, isPending } = useEditExcelTemplateConfiguration({
    excelTemplateId,
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });

        router.push(
          "/settings/bulk-data-management/excel-template-configuration"
        );
      },
      onError: (error) => onError(error),
    },
  });

  const defaultValues = useMemo(() => {
    if (excelTemplateDetail) {
      const latestExcelTemplateDetail: ExcelConfigurationPayload = {
        company_id: excelTemplateDetail.company_id ?? null,
        excel_master_id: excelTemplateDetail.excel_master_id ?? null,
        template_name: excelTemplateDetail.template_name ?? null,
        excel_template_fields: excelTemplateDetail.excel_template_fields,
      };

      return latestExcelTemplateDetail;
    }
  }, [excelTemplateDetail]);

  const onUpdateExcelTemplate = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Stack gap="10px">
      <Breadcrumbs
        items={[
          {
            icon: <SvgsHome />,
            onClick: () => router.push("/"),
          },
          {
            text: "Settings",
          },
          {
            text: "Bulk Data Management",
          },
          {
            text: "Excel Template Configuration",
            onClick: () =>
              router.push(
                "/settings/bulk-data-management/excel-template-configuration"
              ),
          },
          {
            text: "Edit Excel Template Configuration",
          },
        ]}
      />

      <Card heading="Edit Excel Template Configuration">
        <FormContainer>
          <FormSection>
            <ExcelTemplateConfigurationForm
              ref={formRef}
              defaultValues={defaultValues}
              loading={isPendingLatestExcelTemplate}
            />

            <Stack gap="5px" direction="row" justifyContent="end">
              <Button
                variant="outlined"
                disabled={isPending || isPendingLatestExcelTemplate}
                onClick={() =>
                  router.push(
                    "/settings/bulk-data-management/excel-template-configuration"
                  )
                }
              >
                Cancel
              </Button>

              <EditAction
                loading={isPending}
                disabled={isPendingLatestExcelTemplate}
                onClick={onUpdateExcelTemplate}
              />
            </Stack>
          </FormSection>
        </FormContainer>
      </Card>
    </Stack>
  );
}
