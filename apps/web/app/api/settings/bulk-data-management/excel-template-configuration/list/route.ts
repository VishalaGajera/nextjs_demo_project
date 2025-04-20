import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Excel Template configuration listed successfully.",
      data: {
        totalCount: 4,
        excelTemplates: [
          {
            id: "ff693729-fd34-4972-9978-bb8a97675444",
            template_name: "Manish1",
            excel_master_id: "48affb65-4df8-4966-83ae-e10867a05137",
            master_name: "Family Details",
            company_id: "160c179d-b6fe-42c3-8e85-cc77915b3624",
            company_name: "Cmcreation Pvt Ltd",
            is_active: true,
            action_by: "Chirag Sondagar",
            action_at: "2024-12-23T12:48:04.642Z",
            full_count: "4",
          },
          {
            id: "778fa946-269e-4409-96e6-cafefda84125",
            template_name: "Family Details Template111",
            excel_master_id: "48affb65-4df8-4966-83ae-e10867a05137",
            master_name: "Family Details",
            company_id: "160c179d-b6fe-42c3-8e85-cc77915b3624",
            company_name: "Cmcreation Pvt Ltd",
            is_active: true,
            action_by: "Demo Demo",
            action_at: "2024-12-23T06:48:37.567Z",
            full_count: "4",
          },
          {
            id: "57acc3ee-2905-4ca5-bd8d-b3204483ded9",
            template_name: "Family Details Template",
            excel_master_id: "48affb65-4df8-4966-83ae-e10867a05137",
            master_name: "Family Details",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            company_name: "Codezee Solutions PVT Ltd.",
            is_active: true,
            action_by: "Demo Demo",
            action_at: "2024-12-20T09:40:25.940Z",
            full_count: "4",
          },
          {
            id: "44f39bc8-b4f8-46f1-9de6-1c0c702aa099",
            template_name: "Family Details Template1",
            excel_master_id: "48affb65-4df8-4966-83ae-e10867a05137",
            master_name: "Family Details",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            company_name: "Codezee Solutions PVT Ltd.",
            is_active: true,
            action_by: "Demo Demo",
            action_at: "2024-12-20T09:42:41.184Z",
            full_count: "4",
          },
        ],
      },
    },
    { status: 200 }
  );
}
