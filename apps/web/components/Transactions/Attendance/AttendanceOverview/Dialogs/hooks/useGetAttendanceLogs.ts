import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { ATTENDANCE_OVERVIEW_ROUTES } from "../../../../../../constants/routes/transactions/attendance/attendance-overview/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { attendanceLogsKey } from "../../../../../../queryKeysFactories/attendanceView";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { AttendanceLogs } from "./type";

type UseGetAttendanceLogsArgs = {
  selectedEmployeeId: string;
  date: string;
};

export function useGetAttendanceLogs({
  selectedEmployeeId,
  date,
}: UseGetAttendanceLogsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const currentDate = DateTime.fromISO(date).toISODate() ?? "";

  const fetchAttendanceLogs = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<AttendanceLogs>>(
      ATTENDANCE_OVERVIEW_ROUTES.get(selectedEmployeeId, currentDate)
    );

    const updatedData = {
      ...data,
      logs: {
        manual: data.logs?.manual.map((item) => ({
          ...item,
          in_time:
            DateTime.fromISO(item.in_time, {
              zone: "utc",
            }).toISO() ?? "",
          out_time:
            DateTime.fromISO(item.out_time, {
              zone: "utc",
            }).toISO() ?? "",
        })),
        machine: data.logs?.machine.map((item) => ({
          ...item,
          in_time:
            DateTime.fromISO(item.in_time, {
              zone: "utc",
            }).toISO() ?? "",
          out_time:
            DateTime.fromISO(item.out_time, {
              zone: "utc",
            }).toISO() ?? "",
        })),
      },
    };

    return updatedData;
  };

  return useQuery({
    queryKey: attendanceLogsKey.get(selectedEmployeeId, date),
    queryFn: () => fetchAttendanceLogs(),
    enabled: !!selectedEmployeeId && !!date,
    initialData: {} as AttendanceLogs,
  });
}
