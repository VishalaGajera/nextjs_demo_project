import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const section = searchParams.get("section");

  if (section === "company") {
    const response = {
      message: "Employee organization details retrieved successfully.",
      data: {
        id: "160c179d-b6fe-42c3-8e85-cc77915b3624",
        name: "Cmcreation Pvt Ltd",
        action_by: "Kenil Borad",
        action_at: "2024-08-20T04:21:47.788Z",
      },
    };

    return NextResponse.json(response, { status: 200 });
  }

  return NextResponse.json(
    {
      message: "Employee post details retrieved successfully.",
      data: {
        company: {
          id: "160c179d-b6fe-42c3-8e85-cc77915b3624",
          name: "Cmcreation Pvt Ltd",
          action_by: "Kenil Borad",
          action_at: "2024-08-20T04:21:47.788Z",
        },
        business_unit: {
          // "business_unit_id": "e48bb53c-a8d6-423f-a189-507655a65e4c",
          id: "e48bb53c-a8d6-423f-a189-507655a65e4c",
          // "business_unit_name": "CMC Design & Development",
          name: "CMC Design & Development",
          remark: "",
          effective_from: "2024-08-20T04:21:47.788Z",
          action_by: "Kenil Borad",
          action_at: "2024-08-20T04:21:47.788Z",
        },
        business_unit_location: {
          id: "d3eb118d-d5c6-4abb-9830-edcbe5ca05ad",
          name: "Bengaluru",
          remark: "",
          effective_from: "2024-08-20T04:21:47.788Z",
          action_by: "Kenil Borad",
          action_at: "2024-08-20T04:21:47.788Z",
        },
        reporting_manager: {
          name: "Testing Fields",
          effective_from: "2024-08-19T18:30:00.000Z",
          remark: null,
          action_at: "2024-08-29T12:33:40.671Z",
          action_by: "Demo Demo",
        },
      },
    },
    { status: 200 }
  );
}
export async function PATCH() {
  return NextResponse.json(
    {
      message: "Reporting Manager updated successfully.",
      data: {
        id: "9ebeddc7-ed56-43b0-8767-4f3a0c784e51",
        employee_id: "df24378f-14c5-44cb-af2c-707e2c4c2696",
        remark: "remark",
        effective_from: "2024-08-20T04:21:47.788Z",
      },
    },
    { status: 200 }
  );
}
