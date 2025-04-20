import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Scheme details history listed successfully.",
      data: {
        totalCount: 1,
        histories: [
          {
            name: "Single OT",
            effective_from: "2024-08-29T18:30:00.000Z",
            effective_to: null,
            status: "current",
            remark: null,
            action_by: "Demo Demo",
            action_at: "2024-08-30T09:41:59.138Z",
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
