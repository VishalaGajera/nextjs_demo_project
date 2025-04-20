import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Grades retrieved successfully.",
      data: [
        {
          value: "215407f2-2049-4445-a355-a2ae8b8abca5",
          label: "Senior Manager Officer",
        },
        {
          value: "8c860d9d-534d-4ec8-8cf7-9055e1287a9e",
          label: "Senior Manager Officer1",
        },
        {
          value: "0aed27d9-1f44-4b29-b128-c0534852822f",
          label: "Junior Developer",
        },
        {
          value: "5991d84e-a431-4902-a0d9-b54134f420cb",
          label: "Product Manager",
        },
        {
          value: "a0323386-0604-48b3-bd6e-7f2837714bee",
          label: "Chief Technical Officer",
        },
      ],
    },
    { status: 200 }
  );
}
