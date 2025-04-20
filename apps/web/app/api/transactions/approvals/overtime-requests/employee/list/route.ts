import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Employee overtime requests retrieved successfully.",
      data: {
        totalCount: 2,
        overtimeRequestApprovals: [
          {
            id: "8c8566ec-c898-40dc-9796-5e36625a242d",
            employee_id: "66542479-6f98-47d4-9cca-a14a2130a1c4",
            employee_name: "Hinal Rajput",
            avatar:
              "https://sixtify.s3.amazonaws.com/1736493577159_download (2).jpg",
            department_name: "Product Development",
            overtime_date: "2025-02-12T18:30:00.000Z",
            requested_by: null,
            requested_date: "2025-02-19T06:53:16.505Z",
            in_time_overtime: "23:30:00+00",
            out_time_overtime: "23:29:00+00",
            request_overtime_work_hours: "14:59",
            final_overtime_work_hours: "08:30:00",
            remark: "System Generated Overtime Request",
            status: "pending",
            last_action_remark: null,
            last_action_type: "auto",
            last_action_at: null,
            last_action_by: null,
            next_approver: ["Chirag Sondagar"],
            full_count: "3",
          },
          {
            id: "23ff0095-cadf-48b0-887d-2dc3062ccfbb",
            employee_id: "8128d765-74e7-462a-8cdb-edbed4acd9cf",
            employee_name: "Kajal Sharma",
            avatar:
              "https://sixtify.s3.amazonaws.com/1731468806772_2022-07-15.jpg",
            department_name: "Research and Development",
            overtime_date: "2025-01-31T18:30:00.000Z",
            requested_by: "Kajal Sharma",
            requested_date: "2025-02-18T06:38:21.255Z",
            in_time_overtime: "15:30:00+00",
            out_time_overtime: "20:29:00+00",
            request_overtime_work_hours: "23:00",
            final_overtime_work_hours: "00:00:00",
            remark: "create",
            status: "pending",
            last_action_remark: null,
            last_action_type: "test approved",
            last_action_at: "2025-02-18T06:38:21.255Z",
            last_action_by: "Kajal Sharma",
            next_approver: ["Alice Smith"],
            full_count: "3",
          },
          {
            id: "90eace6c-7948-46d9-b004-a7641f464d67",
            employee_id: "f8d860f0-c093-4d88-808c-75a23779a105",
            employee_name: "Jaimin Patel",
            avatar:
              "https://sixtify.s3.amazonaws.com/1735554994396_jc-initial-logo-design-monogram-isolated-on-white-background-700-186813997.jpg",
            department_name: "Research and Development",
            overtime_date: "2025-02-02T18:30:00.000Z",
            requested_by: "Jaimin Patel",
            requested_date: "2025-02-03T05:53:40.233Z",
            in_time_overtime: "23:30:00+00",
            out_time_overtime: "23:29:00+00",
            request_overtime_work_hours: "14:59",
            final_overtime_work_hours: "00:00:00",
            remark: "I want to do OT",
            status: "pending",
            last_action_remark: null,
            last_action_type: "auto",
            last_action_at: "2025-02-18T06:38:21.255Z",
            last_action_by: null,
            next_approver: ["Alice Smith"],
            full_count: "3",
          },
        ],
      },
    },
    { status: 200 }
  );
}
