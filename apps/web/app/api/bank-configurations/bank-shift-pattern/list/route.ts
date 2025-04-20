import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Bank shift pattern listed successfully",
      data: {
        totalCount: 1,
        bankShiftPatterns: [
          {
            id: "f852ef6d-5c70-4d57-888f-54860d96744d",
            company_name: "POPULAR INDUSTRIES",
            bank_shift_pattern_name: "Moon Time Workers",
            pattern_type: "weekly",
            pattern_repeat: 2,
            action_by: "Demo Demo",
            action_at: "2025-02-15T10:14:12.050Z",
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
