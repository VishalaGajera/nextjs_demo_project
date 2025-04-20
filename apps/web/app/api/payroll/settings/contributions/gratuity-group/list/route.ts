import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    statusCode: 200,
    message: "Gratuity Groups listed successfully",
    data: {
      totalCount: 5,
      gratuityGroups: [
        {
          id: "f351e047-d15e-478e-a9d5-91c1562fa71a",
          company_name: "Codezee Solutions PVT Ltd.",
          min_tenure_year: 5,
          number_of_days_in_year: 140,
          avg_monthly_working_day: 20,
          action_by: "Prem Patel",
          action_at: "2025-01-30T06:17:59.214Z",
          full_count: "5",
        },
        {
          id: "f467c8e4-0501-4cfc-8a15-3ed46312ba59",
          company_name: "RAMKRISHNA DIAMOND PVT.LTD",
          min_tenure_year: 30,
          number_of_days_in_year: 365,
          avg_monthly_working_day: 30,
          action_by: "Prem Patel",
          action_at: "2025-01-21T04:49:48.655Z",
          full_count: "5",
        },
        {
          id: "4918e014-1f53-4a8f-9c9a-098d43ef9a4b",
          company_name: "Testing O tech.",
          min_tenure_year: 4,
          number_of_days_in_year: 100,
          avg_monthly_working_day: 10,
          action_by: "Prem Patel",
          action_at: "2025-01-21T04:49:10.593Z",
          full_count: "5",
        },
        {
          id: "2a4b3679-cff2-4826-aa3d-fa1f8218870c",
          company_name: "POPULAR INDUSTRIES",
          min_tenure_year: 8,
          number_of_days_in_year: 170,
          avg_monthly_working_day: 20,
          action_by: "Prem Patel",
          action_at: "2025-01-21T04:48:08.683Z",
          full_count: "5",
        },
        {
          id: "34193f0c-2f65-4366-b13a-48f8e4d11b5c",
          company_name: "Logitech Manufacturing",
          min_tenure_year: 1,
          number_of_days_in_year: 160,
          avg_monthly_working_day: 30,
          action_by: "Prem Patel",
          action_at: "2025-01-21T04:46:35.493Z",
          full_count: "5",
        },
      ],
    },
  });
}
