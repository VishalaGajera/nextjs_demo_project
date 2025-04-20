import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Sub caste listed successfully.",
      data: {
        totalCount: 6,
        subCastes: [
          {
            id: "264ca9c9-d452-44fe-9db3-6ef816fa0095",
            caste_name: "brahmin",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            sub_caste_name: "Patel",
            is_active: true,
            company_name: "Codezee Solutions PVT Ltd.",
            action_by: "Demo Demo",
            action_at: "2024-09-03T12:35:43.455Z",
            full_count: "6",
          },
          {
            id: "b30048c4-ebf8-47cd-b9c2-4dac1943f5bc",
            caste_name: "brahmin",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            sub_caste_name: "Patel",
            is_active: true,
            company_name: "Codezee Solutions PVT Ltd.",
            action_by: "Demo Demo",
            action_at: "2024-09-03T12:34:23.648Z",
            full_count: "6",
          },
          {
            id: "25e3fe34-017a-49ec-a826-332fdacd7f96",
            caste_name: "brahmin",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            sub_caste_name: "Patel",
            is_active: true,
            company_name: "Codezee Solutions PVT Ltd.",
            action_by: "Demo Demo",
            action_at: "2024-09-03T12:34:20.844Z",
            full_count: "6",
          },
          {
            id: "393e1789-554b-4d43-9d47-a9bc50a5f09a",
            caste_name: "brahmin",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            sub_caste_name: "Patel",
            is_active: true,
            company_name: "Codezee Solutions PVT Ltd.",
            action_by: "Demo Demo",
            action_at: "2024-09-03T12:34:13.170Z",
            full_count: "6",
          },
          {
            id: "8ebb9638-72a1-4ecf-9bdb-24470d5b1021",
            caste_name: "brahmin",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            sub_caste_name: "Patel",
            is_active: true,
            company_name: "Codezee Solutions PVT Ltd.",
            action_by: "Demo Demo",
            action_at: "2024-09-03T11:28:32.392Z",
            full_count: "6",
          },
          {
            id: "64df2a27-9970-46ae-ad00-3cbc560fd023",
            caste_name: "brahmin",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            sub_caste_name: "patel",
            is_active: true,
            company_name: "Codezee Solutions PVT Ltd.",
            action_by: "Demo Demo",
            action_at: "2024-08-20T07:35:39.209Z",
            full_count: "6",
          },
        ],
      },
    },
    { status: 200 }
  );
}
