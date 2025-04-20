import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const section = searchParams.get("section");

  if (section === "business_unit") {
    const response = {
      message: "Business Unit history listed successfully.",
      data: {
        totalCount: 5,
        histories: [
          {
            name: "Pune",
            effective_from: "2024-10-22T18:30:00.000Z",
            effective_to: "2024-10-25T18:30:00.000Z",
            remark: null,
            status: "upcoming",
            action_by: "Demo Demo",
            action_at: "2024-10-18T04:30:20.180Z",
            full_count: "4",
          },
          {
            name: "Pune",
            effective_from: "2024-10-21T18:30:00.000Z",
            effective_to: "2024-10-22T18:30:00.000Z",
            remark: null,
            status: "upcoming",
            action_by: "Demo Demo",
            action_at: "2024-10-18T04:30:20.180Z",
            full_count: "4",
          },
          {
            name: "Bengaluru",
            effective_from: "2024-10-18T18:30:00.000Z",
            effective_to: "2024-10-20T18:30:00.000Z",
            remark: null,
            status: "current",
            action_by: "Demo Demo",
            action_at: "2024-10-17T04:58:31.282Z",
            full_count: "4",
          },
          {
            name: "Surat",
            effective_from: "2024-10-16T18:30:00.000Z",
            effective_to: "2024-10-17T18:30:00.000Z",
            remark: null,
            status: "past",
            action_by: "Demo Demo",
            action_at: "2024-10-17T04:58:31.282Z",
            full_count: "4",
          },
          {
            name: "Junagadh",
            effective_from: "2024-10-10T18:30:00.000Z",
            effective_to: "2024-10-15T18:30:00.000Z",
            remark: null,
            status: "past",
            action_by: "Demo Demo",
            action_at: "2024-10-17T04:58:31.282Z",
            full_count: "4",
          },
        ],
      },
    };

    return NextResponse.json(response, { status: 200 });
  } else if (section === "business_unit_location") {
    const response = {
      message: "Location history listed successfully.",
      data: {
        totalCount: 2,
        histories: [
          {
            name: "Testing Fields",
            effective_from: "2024-08-19T18:30:00.000Z",
            remark: null,
            action_at: "2024-08-29T12:33:40.671Z",
            action_by: "Demo Demo",
          },
          {
            name: "Testing Fields",
            effective_from: "2024-08-19T18:30:00.000Z",
            remark: null,
            action_at: "2024-08-29T12:33:40.671Z",
            action_by: "Demo Demo",
          },
        ],
      },
    };

    return NextResponse.json(response, { status: 200 });
  } else if (section === "reporting_manager") {
    const response = {
      message: "Reporting history listed successfully.",
      data: {
        totalCount: 2,
        histories: [
          {
            name: "Testing Fields",
            effective_from: "2024-08-19T18:30:00.000Z",
            remark: null,
            action_at: "2024-08-29T12:33:40.671Z",
            action_by: "Demo Demo",
          },
          {
            name: "Testing Fields",
            effective_from: "2024-08-19T18:30:00.000Z",
            remark: null,
            action_at: "2024-08-29T12:33:40.671Z",
            action_by: "Demo Demo",
          },
        ],
      },
    };

    return NextResponse.json(response, { status: 200 });
  }

  return NextResponse.json({ message: "Section not found." }, { status: 404 });
}
