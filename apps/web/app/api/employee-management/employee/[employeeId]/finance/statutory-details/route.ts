import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employee post details retrieved successfully.",
      data: {
        pf_applicable: true,
        epf_group_id: "00df3c76-c635-4663-8132-be939155d32f",
        pf_account_no: "IN/DEL/1234567/7654321",
        pf_joining_date: "2023-07-30T18:30:00.000Z",
        uan_no: "100123456789",
        esic_applicable: true,
        esic_group_id: "5e85b67e-9057-432a-b078-4ae3f23d5307",
        esic_no: "4829157630",
        esic_joining_date: "2023-07-30T18:30:00.000Z",
        pt_applicable: true,
        lwf_applicable: true,
        tds_applicable: true,
        tax_regime_id: "8ecf3e6d-916e-4540-9c75-4620625a083b",
        tax_regime_name: "Old (2022 - 2024)",
        epf_group_name: "Restrict 15000",
        esic_group_name: "Standard ESIC",
      },
    },
    { status: 200 }
  );
}
