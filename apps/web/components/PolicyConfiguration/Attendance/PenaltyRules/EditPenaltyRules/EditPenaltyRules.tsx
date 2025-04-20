import { Button, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { penaltyRuleKeys } from "../../../../../queryKeysFactories/penaltyRule";
import { onError } from "../../../../../utils/errors";
import { EditAction } from "../../../../common/EditAction";
import type { FormRef } from "../AddPenaltyRules/PenaltyRulesForm";
import { PenaltyRulesForm } from "../AddPenaltyRules/PenaltyRulesForm";
import { useEditPenaltyRules } from "./hooks/useEditPenaltyRules";
import { useGetPenaltyRule } from "./hooks/useGetPenaltyRules";

type EditPenaltyRulesProps = {
  penaltyRulesId: string;
};
export const EditPenaltyRules = ({ penaltyRulesId }: EditPenaltyRulesProps) => {
  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: penaltyRuleDetails, isLoading: isPenaltyRuleLoading } =
    useGetPenaltyRule({
      penaltyRulesId,
    });

  const { mutate, isPending } = useEditPenaltyRules({
    penaltyRulesId,
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: penaltyRuleKeys.get(penaltyRulesId),
        });
        toasts.success({ title: data.message });
        router.push("/policy-configuration/attendance/penalty-rules");
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const defaultValues = useMemo(() => {
    if (penaltyRuleDetails) {
      const penaltyRulesValues = penaltyRuleDetails;

      return penaltyRulesValues;
    }
  }, [penaltyRuleDetails]);

  const onEditPenaltyRule = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const onCancel = () => {
    router.push("/policy-configuration/attendance/penalty-rules");
  };

  return (
    <Stack spacing={2}>
      <PenaltyRulesForm
        ref={formRef}
        defaultValues={defaultValues}
        type="edit"
        loading={isPenaltyRuleLoading}
      />
      <Stack direction="row" gap="15px" justifyContent="flex-end">
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <EditAction onClick={onEditPenaltyRule} loading={isPending} />
      </Stack>
    </Stack>
  );
};
