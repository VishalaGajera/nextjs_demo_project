import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();

  return NextResponse.json(
    {
      message: "Holiday Created Successfully",
      data: {
        ...data,
      },
    },
    { status: 200 }
  );
}
