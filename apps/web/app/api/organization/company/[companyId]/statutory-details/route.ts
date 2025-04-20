import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Company fetched successfully.",
      data: {
        cin_no: null,
        pan_no: "AAAAA1111A",
        tan_no: null,
        pf_no: null,
        esi_no: null,
        gst_no: null,
        pt_no: null,
        license_no: "WIPRO12345",
        lwf_est_code: "WIPRO-BLR-789",
        registered_date: null,
      },
    },
    { status: 201 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Company updated successfully.",
      data: {
        registered_date: null,
        pan_no: "ABCDE1234F",
        license_no: "INF12345",
        lwf_est_code: "INF-BLR-001",
      },
    },
    { status: 200 }
  );
}
