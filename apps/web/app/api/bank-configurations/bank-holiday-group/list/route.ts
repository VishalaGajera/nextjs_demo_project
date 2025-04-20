import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Bank holiday group listed successfully.",
      data: [
        {
          id: "2886c028-8b71-4a07-8c25-39e393a7ee0e",
          company_name: "Codezee Solutions PVT Ltd.",
        },
        {
          id: "2886c028-8b71-4a07-8c25-39e393a78e0e",
          company_name: "POPULAR Industries",
        },
        {
          id: "2886c028-8b71-4a07-8c25-39e393a70e0e",
          company_name: "Oozee Technologies",
        },
        {
          id: "2886c028-8b71-4a07-8c25-35e393a7ee0e",
          company_name: "Microloop PVT Ltd.",
        },
        {
          id: "2886c028-8b71-4a07-8c26-39e393a7ee0e",
          company_name: "CRMCreation PVT Ltd.",
        },
      ],
    },
    { status: 200 }
  );
}
