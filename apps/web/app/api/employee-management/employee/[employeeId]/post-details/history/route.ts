import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const section = searchParams.get("section");

  if (section === "designation") {
    const response = {
      message: "Payment details history listed successfully.",
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
  } else if (section === "skill_type") {
    const response = {
      message: "Skill type history listed successfully.",
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

  return NextResponse.json(
    {
      message: "Section not found.",
    },
    { status: 404 }
  );
}
