import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();

  return NextResponse.json(
    {
      message: "Holiday Group Created Successfully",
      data: {
        id: "new-generated-id",
        ...data,
      },
    },
    { status: 201 }
  );
}
