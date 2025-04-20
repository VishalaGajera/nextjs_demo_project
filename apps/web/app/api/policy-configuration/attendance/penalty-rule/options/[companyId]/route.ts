import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Attendance penalty rules retrieved successfully.",
      data: [
        {
          value: "21ea33b5-928d-4c8a-a6d8-7aab4499adfe",
          label: "NAIMALE",
        },
        {
          value: "0db98a5a-7c5b-4ce8-ad7d-164ceae0aa69",
          label: "Dhruvil R",
        },
        {
          value: "c38c093a-4503-4f23-bfd4-8ab54485ac02",
          label: "NAIMALEEEE",
        },
        {
          value: "20e05a5b-9b21-4154-a0ba-be0740b0a4b7",
          label: "Manager Group",
        },
        {
          value: "094a0744-f826-4334-ba24-4b1a4ebd2a09",
          label: "Codeezee Group",
        },
        {
          value: "36ea392d-a4ef-4338-9478-8505742c9bee",
          label: "NAIMALEe",
        },
        {
          value: "235c3010-60b0-431a-bb38-c175e0283e67",
          label: "CG Group",
        },
      ],
    },
    { status: 200 }
  );
}
