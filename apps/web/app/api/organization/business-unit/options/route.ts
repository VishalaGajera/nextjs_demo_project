import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Business units retrieved successfully.",
      data: [
        {
          value: "8a258ed9-fe02-4bd1-afd2-8ef2bc9f6b5a",
          label: "Eta Media",
        },
        {
          value: "dc631d67-a061-46f6-8f11-a0818f3bca8b",
          label: "Zeta Logistics",
        },
        {
          value: "a2daf017-592c-467a-8a89-ae48f6082664",
          label: "Epsilon Technologies",
        },
        {
          value: "d4283637-96ba-4719-a0bf-2152698f23a7",
          label: "Delta Innovations",
        },
        {
          value: "a1201188-8a00-49cc-aed0-fd045a9e04da",
          label: "Gamma Enterprises",
        },
        {
          value: "1968db65-2fec-4daf-ab9c-e546e33596fc",
          label: "Beta Solutions",
        },
        {
          value: "f15bec4d-86ab-4601-a4e9-b91c184466b4",
          label: "demo",
        },
        {
          value: "c12711d9-a411-4712-98e4-3f5e4b01c89a",
          label: "Code Info",
        },
      ],
    },
    { status: 200 }
  );
}
