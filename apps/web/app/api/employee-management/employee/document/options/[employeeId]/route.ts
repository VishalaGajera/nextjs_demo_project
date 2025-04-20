import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employee document retrieved successfully.",
      data: [
        {
          label: "Aadhaar Card",
          value: "aadhaar_card",
          disabled: true,
        },
        {
          label: "Pan Card",
          value: "pan_card",
          disabled: true,
        },
        {
          label: "Voter Id",
          value: "voterid_card",
          disabled: true,
        },
        {
          label: "Driving License",
          value: "driving_license",
          disabled: false,
        },
        {
          label: "Previous Experience",
          value: "previous_experience",
          disabled: false,
        },
        {
          label: "Degree & Certificate",
          value: "degrees_certificates",
          disabled: false,
        },
        {
          label: "Signature",
          value: "signature",
          disabled: false,
        },
      ],
    },
    { status: 200 }
  );
}
