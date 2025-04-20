import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Banks retrieved successfully.",
      data: [
        {
          value: "8e16ee71-1655-4845-9271-b331134415f4",
          label: "Punjab National Bank",
        },
        {
          value: "357c6b3a-18b9-44fa-8b84-7fa1ac3ee510",
          label: "Axis Bank",
        },
        {
          value: "b493d181-603b-4d38-a569-aeabb8f82cbd",
          label: "Bank of Baroda",
        },
        {
          value: "2a231dbf-3a09-4ef9-88cc-1febe2e5ff41",
          label: "Union Bank of India",
        },
        {
          value: "74008240-7a2a-4760-be11-ec9a4ceac7ad",
          label: "IndusInd Bank",
        },
        {
          value: "7abcc524-e8d5-4a1e-829c-41af4d212ec8",
          label: "IDBI Bank",
        },
        {
          value: "53186ff9-dc41-4a0d-848a-915ca7978d73",
          label: "Yes Bank",
        },
        {
          value: "a890e679-3f4a-4b5c-a144-9d65ec5de3b9",
          label: "Bank of India (BoI)",
        },
        {
          value: "51de2fdc-09ba-4556-b4fd-c4173e72bf96",
          label: "Indian Bank",
        },
        {
          value: "23a886aa-8728-4ee8-87e5-2f855c1e3b0e",
          label: "Central Bank of India",
        },
        {
          value: "695130d3-b017-4eff-a349-31147e880073",
          label: "UCO Bank",
        },
        {
          value: "8e28e8c0-62b8-45b6-adeb-7e9e10323bbb",
          label: "Bank of Maharashtra",
        },
        {
          value: "7390df2a-badc-4189-a060-974b2d3ce217",
          label: "Punjab & Sind Bank",
        },
        {
          value: "8d53a915-6520-468e-a613-c7ff7d928eed",
          label: "Federal Bank",
        },
        {
          value: "2dbe1fd9-4704-4def-ba14-d8cdf106bd9c",
          label: "South Indian Bank",
        },
        {
          value: "ab495483-dd5a-450b-8478-ba04d492eaf9",
          label: "ICICI Bank",
        },
        {
          value: "ee9fb0ca-0dfc-45cd-8944-19ff12e1e391",
          label: "State Bank of India",
        },
        {
          value: "0622f534-37fd-447d-b69c-0e23ae264b37",
          label: "HDFC Bank",
        },
        {
          value: "41c92451-1ed7-45f4-a5b2-ebc73049d71e",
          label: "Kotak Mahindra Bank",
        },
        {
          value: "52122d42-87e9-4734-9d5e-cd349f38aa40",
          label: "Canara Bank",
        },
      ],
    },
    { status: 200 }
  );
}
