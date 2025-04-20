"use client";

import {
  Breadcrumbs,
  Card,
  PadBox,
  SvgsHome,
  toasts,
} from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isEmpty, merge } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef } from "react";
import { useApplicationContext } from "../../../../app/context/ApplicationContext";
import {
  DIRECTORY,
  LIST,
} from "../../../../app/employee-management/employee/hooks/constant";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { dateDaysDifference, getAgeCalculate } from "../../../../utils/date";
import { onError } from "../../../../utils/errors";
import AddDraftEmployeeDialog from "../AddEmployee/AddDraftEmployeeDialog";
import type { DocumentFormFieldValues } from "../AddEmployee/Document/Dialog/DocumentForm";
import type {
  EmployeeFormFieldValues,
  FormRef,
} from "../AddEmployee/EmployeeForm";
import { EmployeeForm, formDefaultValues } from "../AddEmployee/EmployeeForm";
import { useEditEmployeeDraft } from "./hooks/useEditEmployeeDraft";
import { useGetEmployeeDraft } from "./hooks/useGetEmployeeDraft";

type EditEmployeeArgs = Readonly<{
  employeeId: string;
}>;

type Document = {
  document_type: DocumentFormFieldValues["document_type"];
  document_details: Partial<DocumentFormFieldValues>;
};

export const EditEmployee = ({ employeeId }: EditEmployeeArgs) => {
  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const {
    documentFormValues,
    isOpenAddEditEmployeePage,
    setEmployeeFormValues,
    setDocumentFormValues,
    setIsOpenAddEditEmployeePage,
  } = useApplicationContext();

  const searchParams = useSearchParams();

  const view = searchParams.get("view") === DIRECTORY ? DIRECTORY : LIST;

  const isDraft =
    searchParams.get("isDraft") === "true"
      ? Boolean(searchParams.get("isDraft"))
      : false;

  const dialogRenderer: DialogRenderer = {
    saveAsDraft: (
      <AddDraftEmployeeDialog
        open
        onDialogClose={onDialogClose}
        onSuccess={() => {
          router.push(
            `/employee-management/employee?view=${view}${isDraft ? "&isDraft=true" : ""}`
          );
        }}
      />
    ),
  };

  const { data: employeeDraft, isPending: isPendingEmployeeDraft } =
    useGetEmployeeDraft({
      employeeId,
    });

  const { mutate, isPending } = useEditEmployeeDraft({
    employeeId,
    options: {
      onSuccess: (data) => {
        if (!isEmpty(documentFormValues)) {
          setDocumentFormValues([]);
        }

        setEmployeeFormValues(formDefaultValues);

        setIsOpenAddEditEmployeePage(false);

        toasts.success({ title: data.message });

        router.push(
          `/employee-management/employee?view=${view}${isDraft ? "&isDraft=true" : ""}`
        );
      },
      onError: (res) => {
        const { error, message } = res.response.data;

        const formattedError: EmployeeFormFieldValues = merge(
          error?.["basic_details"] ?? {},
          error?.["work_details"] ?? {},
          ...(error?.document_details
            ? [{ document_details: error.document_details }]
            : [])
        );

        const structuredError = {
          response: {
            data: {
              message,
              error: formattedError,
            },
          },
          status: res.status,
        };

        onError(structuredError, formRef.current?.setError, [
          { document_details: "Document is invalid" },
        ]);
      },
    },
  });

  const breadcrumbsItems = [
    {
      icon: <SvgsHome />,
      onClick: () => {
        if (isOpenAddEditEmployeePage) {
          onDialogOpen("saveAsDraft");
        } else {
          router.push("/");
        }
      },
    },
    {
      text: "Employee Management",
    },
    {
      text: "Employee",
      onClick: () => {
        if (isOpenAddEditEmployeePage) {
          onDialogOpen("saveAsDraft");
        }
      },
    },
    {
      text: "Edit Employee",
    },
  ];

  const defaultValues = useMemo(() => {
    const getDocumentData = (documentList: Document[]) => {
      // eslint-disable-next-line sonarjs/cognitive-complexity
      return documentList.map((document: Document) => {
        return {
          document_type: document.document_type ?? null,
          address: document.document_details.address ?? null,
          blood_group: document.document_details.blood_group ?? null,
          branch_name: document.document_details.branch_name ?? null,
          cgpa_or_percentage: document.document_details.cgpa_or_percentage
            ? Number(document.document_details.cgpa_or_percentage)
            : null,
          company_name: document.document_details.company_name ?? null,
          completion_year: document.document_details.completion_year ?? null,
          date_of_birth: document.document_details.date_of_birth ?? null,
          degree: document.document_details.degree ?? null,
          document_no: document.document_details.document_no ?? null,
          document_url: document.document_details.document_url ?? [],
          expiry_date: document.document_details.expiry_date ?? null,
          gender: document.document_details.gender ?? null,
          issue_date: document.document_details.issue_date ?? null,
          job_title: document.document_details.job_title ?? null,
          joining_date: document.document_details.joining_date ?? null,
          joining_year: document.document_details.joining_year ?? null,
          name: document.document_details.name ?? null,
          relieving_date: document.document_details.relieving_date ?? null,
          university_or_college:
            document.document_details.university_or_college ?? null,
        };
      });
    };

    if (employeeDraft) {
      const probationPeriod =
        employeeDraft.basic_details.joining_date &&
        employeeDraft.basic_details.confirmation_date
          ? dateDaysDifference(
              employeeDraft.basic_details.joining_date,
              employeeDraft.basic_details.confirmation_date
            )
          : null;

      const employeeFormFieldValues: EmployeeFormFieldValues = {
        submitType: "save",
        title: employeeDraft.basic_details.title,
        first_name: employeeDraft.basic_details.first_name,
        middle_name: employeeDraft.basic_details.middle_name,
        last_name: employeeDraft.basic_details.last_name,
        nick_name: employeeDraft.basic_details.nick_name,
        date_of_birth: employeeDraft.basic_details.date_of_birth,
        age: employeeDraft.basic_details.date_of_birth
          ? getAgeCalculate(employeeDraft.basic_details.date_of_birth)
          : null,
        gender: employeeDraft.basic_details.gender,
        joining_date: employeeDraft.basic_details.joining_date,
        on_book_joining_date: employeeDraft.basic_details.on_book_joining_date,
        confirmation_date: employeeDraft.basic_details.confirmation_date,
        probation_period: probationPeriod,
        email: employeeDraft.basic_details.email,
        mobile_no: employeeDraft.basic_details.mobile_no,
        alternate_mobile_no: employeeDraft.basic_details.alternate_mobile_no,
        avatar: employeeDraft.basic_details.avatar,
        company_id: employeeDraft.work_details.company_id,
        business_unit_id: employeeDraft.work_details.business_unit_id,
        business_unit_location_id:
          employeeDraft.work_details.business_unit_location_id,
        employee_code_id: employeeDraft.work_details.employee_code_id ?? null,
        employee_code_type:
          employeeDraft.work_details.employee_code_type ?? "auto",
        employee_code: employeeDraft.work_details.employee_code ?? null,
        punch_code: employeeDraft.work_details.punch_code,
        department_id: employeeDraft.work_details.department_id,
        sub_department_id: employeeDraft.work_details.sub_department_id,
        designation_id: employeeDraft.work_details.designation_id,
        grade_id: employeeDraft.work_details.grade_id,
        work_type_id: employeeDraft.work_details.work_type_id,
        skill_type_id: employeeDraft.work_details.skill_type_id,
        reporting_manager_id: employeeDraft.work_details.reporting_manager_id,
        attendance_penalty_rule_id:
          employeeDraft.work_details.attendance_penalty_rule_id,
        overtime_rule_id: employeeDraft.work_details.overtime_rule_id,
        leave_plan_id: employeeDraft.work_details.leave_plan_id,
        weekly_off_type_id: employeeDraft.work_details.weekly_off_type_id,
        shift_type_id: employeeDraft.work_details.shift_type_id,
        bank_shift_type_id: employeeDraft.work_details.bank_shift_type_id,
        assigned_roles: employeeDraft.work_details.assigned_roles,
        holiday_group_id: employeeDraft.work_details.holiday_group_id,
        document_details: !isEmpty(employeeDraft.document_details)
          ? getDocumentData(employeeDraft.document_details)
          : [],
      };

      setDocumentFormValues(
        !isEmpty(employeeDraft.document_details)
          ? getDocumentData(employeeDraft.document_details)
          : []
      );

      return employeeFormFieldValues;
    }
  }, [employeeDraft]);

  return (
    <>
      <Stack gap="10px">
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Breadcrumbs items={breadcrumbsItems} />
        </Stack>

        <Card>
          <PadBox padding={{ padding: "20px" }}>
            <EmployeeForm
              ref={formRef}
              view={view}
              isDraft={isDraft}
              employeeId={employeeId}
              defaultValues={defaultValues}
              loading={isPending || isPendingEmployeeDraft}
              onSaveDraftEmployee={(values) => mutate(values)}
            />
          </PadBox>
        </Card>
      </Stack>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
