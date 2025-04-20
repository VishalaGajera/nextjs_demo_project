import type { OvertimesRulesResponse } from "../EditOvertimeRules/Hooks/useGetOvertimeRules";
import type {
  DeletedApprovalWorkflow,
  OvertimeRulesFormFieldValues,
} from "./AddOvertimeRulesForm";
import type { Assignment } from "./hooks/useAddOvertimeRules";

type ApprovalWorkflow = {
  level: number;
  is_auto_approve_days_enabled: boolean;
  assignments: string[] | Assignment[];
  id?: string;
  auto_approve_days?: number | null;
};

export const prepareSubmissionAndApprovalTypeValues = (
  formData: Partial<OvertimeRulesFormFieldValues>
) => {
  const modifiedFormData = formData.submission_and_approval_details;

  if (modifiedFormData) {
    const { approval_workflow, ...restData } = modifiedFormData;

    //TODO: as of now, we do not have to give support for assignments as role :- Mani
    delete restData.is_notice_period_days;

    const manualApproval = {
      ...restData,
      is_comment_required: restData.is_comment_required || false,
      allow_past_dated_request: restData.allow_past_dated_request || false,
      manager_can_submit: restData.manager_can_submit || false,
      notice_period_days: restData.notice_period_days ?? 0,
      notice_period_working_days: restData.notice_period_working_days ?? 0,
      maximum_past_request_days: restData.maximum_past_request_days ?? 0,
    };

    return {
      ...(formData.submission_and_approval_type === "manual_approval" && {
        ...manualApproval,
      }),
      skip_approver_if_not_assigned:
        restData.skip_approver_if_not_assigned || false,
      approval_workflow: approval_workflow.map((item, index) => {
        return {
          ...item,
          level: index + 1,
          is_auto_approve_days_enabled:
            item.is_auto_approve_days_enabled || false,
          assignments: item.assignments.map((assignment) => {
            return {
              overtime_approval_type: "by_employee",
              employee_id: assignment,
            };
          }),
        };
      }),
    };
  }
};

const modifiedAssignments = (assignments: string[]) => {
  return assignments?.map((assignment) => {
    return {
      overtime_approval_type: "by_employee",
      employee_id: assignment,
      action: "add",
    };
  });
};

export const getUpdatedSubmissionAndApprovalDetails = (
  formData: Partial<OvertimeRulesFormFieldValues>,
  initialValues: OvertimesRulesResponse,
  deletedApprovalWorkflow: DeletedApprovalWorkflow[],
  newlyAddedWorkFlow?: ApprovalWorkflow[]
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  //TODO: as of now, we do not have to give support for assignments as role :- Mani

  const initialWorkFlow =
    initialValues?.submission_and_approval_details?.approval_workflow || [];

  const currentWorkFlow =
    formData?.submission_and_approval_details?.approval_workflow || [];

  const result = [];

  for (const row of initialWorkFlow) {
    const match: ApprovalWorkflow | undefined = currentWorkFlow.find(
      (cRow) => cRow?.id === row.id
    );

    if (match) {
      const updatedRow = {
        ...match,
        action: "update",
      };

      // Handle assignments at the second level
      if (
        match?.assignments?.length &&
        match.assignments.every((item) => typeof item === "string") &&
        row.assignments?.length
      ) {
        const currentAssignments = new Set(match.assignments || []);

        const initialAssignments = new Set(
          row.assignments.map((a) => a.employee_id)
        );

        updatedRow.assignments = row.assignments
          .map((a) => ({
            ...a,
            action: currentAssignments.has(a.employee_id) ? null : "delete",
          }))
          .filter((a) => a.action !== null);

        for (const assignment of match.assignments || []) {
          if (!initialAssignments.has(assignment)) {
            updatedRow.assignments.push({
              overtime_approval_type: "by_employee",
              employee_id: assignment,
              action: "add",
            });
          }
        }
      }

      result.push(updatedRow);
    }
  }

  if (deletedApprovalWorkflow?.length) {
    deletedApprovalWorkflow.forEach((item) => {
      result.push(item);
    });
  }

  if (newlyAddedWorkFlow?.length) {
    newlyAddedWorkFlow.forEach((item) => {
      if (item.assignments.every((item) => typeof item === "string")) {
        const updatedAssignments = modifiedAssignments(item.assignments);

        result.push({
          ...item,
          assignments: updatedAssignments,
          action: "add",
        });
      }
    });
  }

  const submissionAndApprovalDetails = {
    ...formData.submission_and_approval_details,
  };

  delete submissionAndApprovalDetails.approval_workflow;
  delete submissionAndApprovalDetails.is_notice_period_days;

  if (result.length) {
    return {
      submission_and_approval_details: {
        ...submissionAndApprovalDetails,
        approval_workflow: result,
      },
    };
  }

  return {
    submission_and_approval_details: {
      ...submissionAndApprovalDetails,
    },
  };
};
