import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employee post details retrieved successfully.",
      data: {
        department: {
          id: "d33d3c85-edbc-48e2-88e4-5a4384367c26",
          name: "Department",
          effective_from: "2024-08-20T18:30:00.000Z",
          remark: null,
          action_by: "Kenil Borad",
          action_at: "2024-08-28T06:03:11.865Z",
        },
        sub_department: {
          id: "a45c3b85-bdac-41a3-92e4-6a4284567f23",
          name: "Sub-Department",
          effective_from: "2024-07-15T10:20:00.000Z",
          remark: null,
          action_by: "Kenil Borad",
          action_at: "2024-08-25T09:13:45.123Z",
        },
        designation: {
          id: "c56d4d85-ecad-44f4-99d4-7b5395678c34",
          name: "Designation",
          effective_from: "2023-11-10T12:45:00.000Z",
          remark: null,
          action_by: "Kenil Borad",
          action_at: "2024-08-21T14:23:55.789Z",
        },
        grade: {
          id: "f78e5e85-fdac-47g5-11d5-8c6496789d45",
          name: "A",
          effective_from: "2024-01-05T08:30:00.000Z",
          remark: null,
          action_by: "Kenil Borad",
          action_at: "2024-08-22T11:33:22.456Z",
        },
        work_type: {
          id: "g89f6f85-geac-58h6-22e6-9d751789ae56",
          name: "Work Type",
          effective_from: "2024-06-01T09:00:00.000Z",
          remark: null,
          action_by: "Kenil Borad",
          action_at: "2024-08-23T15:44:33.567Z",
        },
        skill_type: {
          id: "h90g7g85-hfac-69i7-33f7-0e86289bcf67",
          name: " Skill Type",
          effective_from: "2024-03-12T11:15:00.000Z",
          remark: null,
          action_by: "Kenil Borad",
          action_at: "2024-08-24T17:55:44.678Z",
        },
      },
    },
    { status: 200 }
  );
}
