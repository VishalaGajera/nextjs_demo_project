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
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../utils/errors";
import {
  type FormRef,
  ExcelTemplateConfigurationForm,
} from "./ExcelTemplateConfigurationForm";
import { useAddExcelTemplateConfiguration } from "./hooks/useAddExcelTemplateConfiguration";

export function AddExcelTemplateConfiguration() {
  const router = useRouter();

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const formRef = useRef<FormRef>(null);

  const { mutate, isPending } = useAddExcelTemplateConfiguration({
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

  const onAddExcelTemplate = () => {
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
            text: "Add Excel Template Configuration",
          },
        ]}
      />

      <Card heading="Add Excel Template Configuration">
        <FormContainer>
          <FormSection>
            <ExcelTemplateConfigurationForm ref={formRef} />

            <Stack gap="5px" direction="row" justifyContent="end">
              <Button
                variant="outlined"
                disabled={isPending}
                onClick={() =>
                  router.push(
                    "/settings/bulk-data-management/excel-template-configuration"
                  )
                }
              >
                Cancel
              </Button>

              <Button
                loading={isPending}
                onClick={onAddExcelTemplate}
                disabled={isDisabled()}
              >
                Save
              </Button>
            </Stack>
          </FormSection>
        </FormContainer>
      </Card>
    </Stack>
  );
}
