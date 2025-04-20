import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Industries retrieved successfully.",
      data: [
        {
          value: "a70492a6-ed18-4632-8a7d-ad0381709f49",
          label: "Manufacturing & Production",
        },
        {
          value: "49adf0aa-4d4c-4d13-9952-946cd7c0592c",
          label: "Education & Training",
        },
        {
          value: "4bee9b78-0691-4da2-ba5f-edead108eaf3",
          label: "Government & Public Administration",
        },
        {
          value: "b49b66bb-ca4a-40f7-ac6c-ba5204951482",
          label: "Non-profit & Social Services",
        },
        {
          value: "bd347116-d420-4168-b3a3-6d6db4e10bd2",
          label: "Energy & Utilities",
        },
        {
          value: "5ef76a5f-7044-4dd0-ba8e-8646364777a5",
          label: "Software & Technology",
        },
        {
          value: "f3ad30c9-25c7-4b4c-a002-fb64fc5c33c6",
          label: "Healthcare & Pharmaceuticals",
        },
        {
          value: "4226ed73-6473-4343-b119-7964d1887104",
          label: "Hospitality & Tourism",
        },
        {
          value: "3838f421-e2b0-408e-b3c9-1d2277c00203",
          label: "Retail & Consumer Goods",
        },
        {
          value: "f1b958ef-2667-4467-b441-dd4245333cc5",
          label: "Construction & Real Estate",
        },
        {
          value: "37caed44-d6a4-4313-984f-a9069fba697a",
          label: "Information Technology & Services",
        },
        {
          value: "d6561355-ee09-4101-9c6d-932f1373e7c1",
          label: "Finance & Banking",
        },
      ],
    },
    { status: 200 }
  );
}
