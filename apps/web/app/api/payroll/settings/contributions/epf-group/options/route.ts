import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "EPF groups retrieved successfully.",
      data: [
        {
          value: "fa5ea99c-13eb-401d-9551-95afb149f833",
          label: "group name",
        },
        {
          value: "5e8d1eec-5a58-4297-9798-df00f8334387",
          label: "group name asd",
        },
      ],
    },
    { status: 200 }
  );
}
