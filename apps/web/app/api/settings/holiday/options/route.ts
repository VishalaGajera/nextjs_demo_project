import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Holidays List Retrieved Successfully",
      data: [
        {
          id: "8c372dda-5620-4dc7-b405-fccc2b2f706b",
          name: "Makar Sankranti",
          date: "2024-08-15T00:00:00.000Z",
        },
      ],
    },
    { status: 200 }
  );
}
