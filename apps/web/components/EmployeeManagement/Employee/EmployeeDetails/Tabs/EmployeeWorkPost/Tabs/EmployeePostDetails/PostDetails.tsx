import { Stack } from "@mui/material";
import { DepartmentCard } from "./Department/DepartmentCard";
import { DesignationCard } from "./Designation/DesignationCard";
import { GradeCard } from "./Grade/GradeCard";
import { useGetPostDetails } from "./hooks/useGetPostDetails";
import { SkillTypeCard } from "./SkillType/SkillTypeCard";
import { SubDepartmentCard } from "./SubDepartment/SubDepartmentCard";
import { WorkTypeCard } from "./WorkType/WorkTypeCard";
type PostDetailProps = {
  employeeId: string;
  companyId: string;
  loading: boolean;
};
export const PostDetails = ({
  employeeId,
  companyId,
  loading,
}: PostDetailProps) => {
  const { data: postDetails, isPending } = useGetPostDetails({
    employeeId,
  });

  return (
    <Stack gap="15px">
      <Stack direction="row" gap="15px">
        <DepartmentCard
          defaultValues={postDetails?.department}
          loading={isPending || loading}
          employeeId={employeeId}
          companyId={companyId}
        />
        <SubDepartmentCard
          defaultValues={postDetails?.sub_department}
          loading={isPending || loading}
          employeeId={employeeId}
          departmentId={postDetails?.department?.id ?? ""}
        />

        <DesignationCard
          defaultValues={postDetails?.designation}
          loading={isPending || loading}
          employeeId={employeeId}
          companyId={companyId}
        />
      </Stack>
      <Stack direction="row" gap="15px">
        <GradeCard
          defaultValues={postDetails?.grade}
          loading={isPending || loading}
          employeeId={employeeId}
          companyId={companyId}
        />

        <WorkTypeCard
          defaultValues={postDetails?.work_type}
          loading={isPending || loading}
          employeeId={employeeId}
          companyId={companyId}
        />

        <SkillTypeCard
          defaultValues={postDetails?.skill_type}
          loading={isPending}
          employeeId={employeeId}
          companyId={companyId}
        />
      </Stack>
    </Stack>
  );
};
