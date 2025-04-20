import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Salary ranges listed successfully.",
    data: [
      {
        id: "e22d2ff0-9b42-4838-b014-319cded67984",
        from_range: 12,
        to_range: 15,
        description: "Required",
      },
      {
        id: "b97640c8-9be6-4f51-aa86-bb6470541df6",
        from_range: 16,
        to_range: 20,
        description: "Required",
      },
    ],
  });
}
