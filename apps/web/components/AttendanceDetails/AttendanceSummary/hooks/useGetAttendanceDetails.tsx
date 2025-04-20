import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { attendanceDetailsKey } from "../../../../queryKeysFactories/attendanceView";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { AttendanceDetails } from "./type";

type UseGetAttendanceDetailsArgs = {
  employeeId: string;
  date: string;
  currentDate: string;
};
export function useGetAttendanceDetails({
  employeeId,
  date,
  currentDate,
}: UseGetAttendanceDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchAttendanceDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<AttendanceDetails>>(
      `api/transactions/attendance/attendance-overview/${employeeId}/attendance-details?datePeriod=${date}&currentDate=${currentDate}`
    );

    return data;
  };

  return useQuery({
    queryKey: attendanceDetailsKey.get(employeeId, date),
    queryFn: fetchAttendanceDetails,
    enabled: !!employeeId && !!date,
    initialData: {} as AttendanceDetails,
  });
}
