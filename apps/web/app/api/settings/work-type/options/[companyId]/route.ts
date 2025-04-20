import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Work types retrieved successfully.",
      data: [
        {
          value: "9831c0ba-4b8e-460e-b55e-1eb794965e7b",
          label: "Part-Time",
        },
        {
          value: "73357eff-9d64-4991-84db-cd1b0b089f00",
          label: "Full Time",
        },
        {
          value: "f9397405-d9b5-4dba-821d-4e683a6f40be",
          label: "Full-time",
        },
        {
          value: "53bb61c2-f595-4965-aee6-1b0280f927ab",
          label: "Part-time",
        },
        {
          value: "e35d0e2b-3546-461b-8ac4-1cad098f7621",
          label: "Contract",
        },
        {
          value: "2f144953-7b27-4285-a705-7117a6d0ef7d",
          label: "Freelance",
        },
      ],
    },
    { status: 200 }
  );
}
