import { Button, Card, toasts } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { forEach, isEmpty, isFunction, isObject, transform } from "lodash";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import {
  EXCEL_FIELD_MAPPING,
  EXCEL_OVERVIEW,
  type OptionKey,
} from "../constant/constant";
import type {
  ExcelImportData,
  ExcelMappedOptions,
  ExcelRowsData,
} from "../ExcelImportProcess";
import { AddAddressDetailsPreviewList } from "./AddAddressDetailsPreviewList/AddAddressDetailsPreviewList";
import { AddBankPreviewList } from "./AddBankPreviewList/AddBankPreviewList";
import { AddDepartmentPreviewList } from "./AddDepartmentPreviewList/AddDepartmentPreviewList";
import { AddDesignationPreviewList } from "./AddDesignationPreviewList/AddDesignationPreviewList";
import { AddEducationDetailsPreviewList } from "./AddEducationDetailsPreviewList/AddEducationDetailsPreviewList";
import { AddEmergencyContactPreviewList } from "./AddEmergencyContactPreviewList/AddEmergencyContactPreviewList";
import type { FormRef } from "./AddEmployeePreviewList/AddEmployeePreviewList";
import { AddEmployeePreviewList } from "./AddEmployeePreviewList/AddEmployeePreviewList";
import { AddFamilyDetailsPreviewList } from "./AddFamilyDetailsPreviewList/AddFamilyDetailsPreviewList";
import { AddGradePreviewList } from "./AddGradePreviewList/AddGradePreviewList";
import { AddHolidayPreviewList } from "./AddHolidayPreviewList/AddHolidayPreviewList";
import { AddIndustryPreviewList } from "./AddIndustryPreviewList/AddIndustryPreviewList";
import { AddSkillTypePreviewList } from "./AddSkillTypePreviewList/AddSkillTypePreviewList";
import { AddSubCastePreviewList } from "./AddSubCastePreviewList/AddSubCastePreviewList";
import { AddSubDepartmentPreviewList } from "./AddSubDepartmentPreviewList/AddSubDepartmentPreviewList";
import { AddWorkTypePreviewList } from "./AddWorkTypePreviewList/AddWorkTypePreviewList";
import type { MasterCodeOptionKeys, MasterCodeOptionValues } from "./constant";
import {
  ADD_BANK,
  ADD_DEPARTMENT,
  ADD_DESIGNATION,
  ADD_EMPLOYEE,
  ADD_EMPLOYEE_ADDRESS_DETAILS,
  ADD_EMPLOYEE_EDUCATION_DETAILS,
  ADD_EMPLOYEE_EMERGENCY_CONTACT,
  ADD_EMPLOYEE_FAMILY_DETAILS,
  ADD_GRADE,
  ADD_HOLIDAY,
  ADD_INDUSTRY,
  ADD_SKILL_TYPE,
  ADD_SUB_CASTE,
  ADD_SUB_DEPARTMENT,
  ADD_WORK_TYPE,
  BANK,
  DEPARTMENT,
  DESIGNATION,
  EMPLOYEE,
  EMPLOYEE_ADDRESS_DETAILS,
  EMPLOYEE_EDUCATION_DETAILS,
  EMPLOYEE_EMERGENCY_CONTACT,
  EMPLOYEE_FAMILY_DETAILS,
  GRADE,
  HOLIDAY,
  INDUSTRY,
  masterCodeOptions,
  SKILL_TYPE,
  SUB_CASTE,
  SUB_DEPARTMENT,
  WORK_TYPE,
} from "./constant";
import { useAddBulkDataUpload } from "./hooks/useAddBulkDataUpload";

type ExcelDataPreviewProps = Readonly<{
  companyId: string;
  excelRowsData: ExcelRowsData;
  excelMappedOptions: ExcelMappedOptions;
  excelTemplateId: string;
  masterCode: MasterCodeOptionKeys;
  setCurrentStep: (value: OptionKey) => void;
  setExcelImportData: React.Dispatch<React.SetStateAction<ExcelImportData>>;
}>;

// Helper function to transform error objects
const transformFieldErrors = (errorObj: Record<string, string>) => {
  return transform(
    errorObj,
    (result: Record<string, string>, value, label) => {
      if (isObject(value)) {
        forEach(value, (nestedValue, nestedKey) => {
          result[nestedKey] = nestedValue as string;
        });
      } else {
        result[label] = value;
      }
    },
    {}
  );
};

// Helper function to handle bulk data errors
const handleBulkDataErrors = (
  bulkDataErrors: Record<string, string>[],
  masterCodeKey: MasterCodeOptionValues,
  formRef: React.RefObject<FormRef>
) => {
  Object.entries(bulkDataErrors).forEach(([key, errorObj]) => {
    const fieldErrors = transformFieldErrors(errorObj);

    if (!isEmpty(fieldErrors)) {
      Object.entries(fieldErrors).forEach(([field, error]) => {
        formRef.current?.setError(`${masterCodeKey}.${Number(key)}.${field}`, {
          type: "manual",
          message: error,
        });
      });
    }
  });
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export function ExcelDataPreview({
  companyId,
  masterCode,
  excelTemplateId,
  excelRowsData,
  excelMappedOptions,
  setCurrentStep,
  setExcelImportData,
}: ExcelDataPreviewProps) {
  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const [loading, setLoading] = useState(false);

  const masterCodeKey: MasterCodeOptionValues = masterCodeOptions[masterCode];

  const renderPreviewList = (
    Component: React.ElementType,
    additionalProps = {}
  ) => (
    <Component
      ref={formRef}
      masterCode={masterCode}
      excelRowsData={excelRowsData}
      excelTemplateId={excelTemplateId}
      excelMappedOptions={excelMappedOptions}
      {...additionalProps}
    />
  );

  const bulkDataUploadFormRenderer = {
    [ADD_EMPLOYEE]:
      masterCodeKey === EMPLOYEE &&
      renderPreviewList(AddEmployeePreviewList, {
        loading,
        companyId,
        setLoading,
      }),

    [ADD_DEPARTMENT]:
      masterCodeKey === DEPARTMENT &&
      renderPreviewList(AddDepartmentPreviewList),

    [ADD_SUB_DEPARTMENT]:
      masterCodeKey === SUB_DEPARTMENT &&
      renderPreviewList(AddSubDepartmentPreviewList, { companyId }),

    [ADD_DESIGNATION]:
      masterCodeKey === DESIGNATION &&
      renderPreviewList(AddDesignationPreviewList),

    [ADD_GRADE]:
      masterCodeKey === GRADE && renderPreviewList(AddGradePreviewList),

    [ADD_WORK_TYPE]:
      masterCodeKey === WORK_TYPE && renderPreviewList(AddWorkTypePreviewList),

    [ADD_SKILL_TYPE]:
      masterCodeKey === SKILL_TYPE &&
      renderPreviewList(AddSkillTypePreviewList),

    [ADD_SUB_CASTE]:
      masterCodeKey === SUB_CASTE && renderPreviewList(AddSubCastePreviewList),

    [ADD_HOLIDAY]:
      masterCodeKey === HOLIDAY && renderPreviewList(AddHolidayPreviewList),

    [ADD_BANK]: masterCodeKey === BANK && renderPreviewList(AddBankPreviewList),

    [ADD_INDUSTRY]:
      masterCodeKey === INDUSTRY && renderPreviewList(AddIndustryPreviewList),

    [ADD_EMPLOYEE_EMERGENCY_CONTACT]:
      masterCodeKey === EMPLOYEE_EMERGENCY_CONTACT &&
      renderPreviewList(AddEmergencyContactPreviewList),

    [ADD_EMPLOYEE_FAMILY_DETAILS]:
      masterCodeKey === EMPLOYEE_FAMILY_DETAILS &&
      renderPreviewList(AddFamilyDetailsPreviewList),

    [ADD_EMPLOYEE_EDUCATION_DETAILS]:
      masterCodeKey === EMPLOYEE_EDUCATION_DETAILS &&
      renderPreviewList(AddEducationDetailsPreviewList),

    [ADD_EMPLOYEE_ADDRESS_DETAILS]:
      masterCodeKey === EMPLOYEE_ADDRESS_DETAILS &&
      renderPreviewList(AddAddressDetailsPreviewList),
  };

  const { mutate, isPending } = useAddBulkDataUpload({
    excelTemplateId: excelTemplateId ?? "",
    masterCode: masterCode ?? "",
    options: {
      onSuccess: (data) => {
        setExcelImportData((prev: ExcelImportData) => ({
          ...prev,
          import_log: data.data.import_log,
        }));

        toasts.success({ title: data.message });

        setCurrentStep(EXCEL_OVERVIEW);
      },
      onError: (res) => {
        const { error } = res.response.data;

        if (
          !isEmpty(error.bulk_data) &&
          formRef.current?.setError &&
          isFunction(formRef.current?.setError)
        ) {
          handleBulkDataErrors(error.bulk_data, masterCodeKey, formRef);
        }
      },
    },
  });

  const onAddBulkDataUpload = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Card>
      <Stack gap="20px">
        <Typography variant="subtitle1">Step 3 : Excel Data Preview</Typography>

        <Typography variant="body2">
          Please check if all the details valid or not and import users
        </Typography>

        {bulkDataUploadFormRenderer[masterCode]}

        <Stack direction="row" justifyContent="end">
          <Stack direction="row" gap="5px">
            <Button
              variant="outlined"
              disabled={isPending}
              onClick={() => {
                router.push("/settings/bulk-data-management/data-upload");
              }}
            >
              Cancel
            </Button>

            <Button
              variant="outlined"
              disabled={isPending}
              onClick={() => {
                setCurrentStep(EXCEL_FIELD_MAPPING);
              }}
            >
              Previous
            </Button>

            <Button
              loading={isPending}
              disabled={isDisabled() || loading}
              onClick={onAddBulkDataUpload}
            >
              Next
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
