import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const section = searchParams.get("section");

  if (section === "shift_type") {
    const response = {
      message: "Employee scheme details retrieved successfully.",
      data: {
        id: "1c913ae3-0a65-4120-9502-e60cc4b21884",
        name: "DAY",
        effective_from: "2024-10-11T18:30:00.000Z",
        effective_to: null,
        has_no_end_date: true,
        remark: null,
        action_by: "Demo Demo",
        action_at: "2024-10-17T04:58:31.282Z",
        joining_date: "2024-10-08T18:30:00.000Z",
      },
    };

    return NextResponse.json(response, { status: 200 });
  } else if (section === "bank_shift_type") {
    const response = {
      message: "Employee scheme details retrieved successfully.",
      data: {
        id: "db4ce937-ae78-45b3-90a8-260fad87b75a",
        name: "DAY",
        effective_from: "2024-10-11T18:30:00.000Z",
        effective_to: null,
        has_no_end_date: true,
        remark: null,
        action_by: "Demo Demo",
        action_at: "2024-10-17T04:58:31.282Z",
        joining_date: "2024-10-08T18:30:00.000Z",
      },
    };

    return NextResponse.json(response, { status: 200 });
  } else if (section === "weekly_off_type") {
    const response = {
      message: "Employee scheme details retrieved successfully.",
      data: {
        id: "00d7a38b-eb18-476a-a723-45d8dd91248b",
        name: "Surat Branch",
        effective_from: "2024-10-11T18:30:00.000Z",
        effective_to: null,
        has_no_end_date: true,
        remark: null,
        action_by: "Demo Demo",
        action_at: "2024-10-17T04:58:31.282Z",
        joining_date: "2024-10-08T18:30:00.000Z",
      },
    };

    return NextResponse.json(response, { status: 200 });
  } else if (section === "holiday_group") {
    const response = {
      message: "Employee scheme details retrieved successfully.",
      data: {
        id: "c0d8a9e3-9c7e-40b7-b8c4-f4a6b7157d6b",
        name: "Gujarat Holiday List",
        effective_from: "2024-01-01T18:30:00.000Z",
        remark: "Includes major public holidays",
        action_by: "Demo Demo",
        action_at: "2024-10-17T04:58:31.282Z",
        joining_date: "2024-10-08T18:30:00.000Z",
      },
    };

    return NextResponse.json(response, { status: 200 });
  } else if (section === "attendance_penalty_rule") {
    const response = {
      message: "Employee scheme details retrieved successfully.",
      data: {
        id: "c7482338-a32f-42d5-834f-51ad871aacfe",
        name: "Day Shift",
        unassigned_rule: true,
        effective_from: "2024-10-16T18:30:00.000Z",
        effective_to: null,
        has_no_end_date: true,
        remark: null,
        action_by: "Demo Demo",
        action_at: "2024-10-18T16:12:52.815Z",
        joining_date: "2024-10-16T18:30:00.000Z",
      },
    };

    return NextResponse.json(response, { status: 200 });
  } else if (section === "overtime_rule") {
    const response = {
      message: "Employee scheme details retrieved successfully.",
      data: {
        id: "c7482338-a32f-42d5-834f-51ad871aacfe",
        name: "Single OT",
        unassigned_rule: true,
        effective_from: "2024-10-16T18:30:00.000Z",
        effective_to: null,
        has_no_end_date: true,
        remark: null,
        action_by: "Demo Demo",
        action_at: "2024-10-18T16:12:52.815Z",
        joining_date: "2024-10-16T18:30:00.000Z",
      },
    };

    return NextResponse.json(response, { status: 200 });
  } else if (section === "leave_plan") {
    const response = {
      message: "Employee scheme details retrieved successfully.",
      data: {
        id: "c7482338-a32f-42d5-834f-51ad871aacae",
        name: "Leave Plan 25",
        unassigned_rule: true,
        effective_from: "2025-01-01T18:30:00.000Z",
        effective_to: null,
        has_no_end_date: true,
        remark: null,
        action_by: "Demo Demo",
        action_at: "2024-12-18T16:12:52.815Z",
        joining_date: "2024-12-16T18:30:00.000Z",
      },
    };

    return NextResponse.json(response, { status: 200 });
  }

  return NextResponse.json(
    {
      message: "Employee scheme details retrieved successfully.",
      data: {
        shift_type: {
          id: "d33d3c85-edbc-48e2-88e4-5a4384367c26",
          name: "Day Shift (9:30 - 18:30)",
          effective_from: "2024-08-20T18:30:00.000Z",
          effective_to: "2024-09-20T18:30:00.000Z",
          has_no_end_date: false,
          remark: null,
          action_by: "Demo Demo",
          action_at: "2024-08-28T06:03:11.865Z",
        },
        bank_shift_type: {
          id: "b21f3c65-eadb-40f2-9a14-2b6d60f1d726",
          name: "Day Shift (9:30 - 18:30)",
          effective_from: "2024-08-15T18:30:00.000Z",
          effective_to: "2024-12-31T18:30:00.000Z",
          has_no_end_date: false,
          remark: "Updated for Q4",
          action_by: "John Doe",
          action_at: "2024-08-25T08:10:30.000Z",
        },
        weekly_off_type: {
          id: "f2e5c1a9-1f47-4e8e-b2d5-0a3f8f1c8e67",
          name: "Weekend Off",
          effective_from: "2024-07-01T18:30:00.000Z",
          effective_to: null,
          has_no_end_date: true,
          remark: "Standard weekly off policy",
          action_by: "Jane Doe",
          action_at: "2024-07-05T10:15:00.000Z",
        },
        holiday_group: {
          id: "c0d8a9e3-9c7e-40b7-b8c4-f4a6b7157d6b",
          name: "Gujarat Holiday List",
          effective_from: "2024-01-01T18:30:00.000Z",
          remark: "Includes major public holidays",
          action_by: "Admin",
          action_at: "2024-01-10T09:00:00.000Z",
        },
        attendance_penalty_rule: {
          id: "c7482338-a32f-42d5-834f-51ad871aacfe",
          name: "Day Shift",
          unassigned_rule: true,
          effective_from: "2024-10-16T18:30:00.000Z",
          effective_to: null,
          has_no_end_date: true,
          remark: null,
          action_by: "Demo Demo",
          action_at: "2024-10-18T16:12:52.815Z",
          joining_date: "2024-10-16T18:30:00.000Z",
        },
        overtime_rule: {
          id: "c7482338-a32f-42d5-834f-51ad871aacfe",
          name: "Single OT",
          unassigned_rule: true,
          effective_from: "2024-10-16T18:30:00.000Z",
          effective_to: null,
          has_no_end_date: true,
          remark: null,
          action_by: "Demo Demo",
          action_at: "2024-10-18T16:12:52.815Z",
          joining_date: "2024-10-16T18:30:00.000Z",
        },
        leave_plan: {
          id: "c7482338-a32f-42d5-834f-51ad871aacae",
          name: "Leave Plan 25",
          unassigned_rule: true,
          effective_from: "2025-01-01T18:30:00.000Z",
          effective_to: null,
          has_no_end_date: true,
          remark: null,
          action_by: "Demo Demo",
          action_at: "2024-12-18T16:12:52.815Z",
          joining_date: "2024-12-16T18:30:00.000Z",
        },
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Employee scheme details updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}
