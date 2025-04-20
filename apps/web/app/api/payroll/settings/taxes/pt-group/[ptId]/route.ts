import { NextResponse } from "next/server";

export async function PATCH() {
  return NextResponse.json(
    {
      message: "PT Group updated successfully.",
      data: null,
    },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json(
    {
      message: "PT group retrieved successfully.",
      data: {
        id: "6ff0b704-dfc5-4103-8001-ec4ed632e522",
        state_id: "f92b38e8-bc51-495e-9578-5c293ce9d821",
        state_name: "Maharashtra",
        deduction_cycle_type: "half_yearly",
        is_gender_specific: false,
        tax_slabs: [
          {
            id: "d39d8aec-4b1e-4ffd-8446-f6d872fa227e",
            start_amount: 1900,
            end_amount: 2000,
            tax_amount: 5000,
            monthly_variations: [
              {
                id: "a911f031-a3fc-4b51-a4e6-934914a2c06b",
                month: 2,
                tax_amount: 2200,
              },
              {
                id: "6e522cf1-6f0c-4a61-8d5e-5f3afb46db5a",
                month: 4,
                tax_amount: 2400,
              },
              {
                id: "8d823d39-28c1-4cda-a70a-b877f7cd7863",
                month: 5,
                tax_amount: 2500,
              },
              {
                id: "bee19627-3521-4644-8b87-054ecc477354",
                month: 12,
                tax_amount: 2000,
              },
            ],
          },
          {
            id: "dcad40ef-8719-49c4-88e9-9ddb17372e2d",
            start_amount: 2001,
            end_amount: 3000,
            tax_amount: 5000,
            monthly_variations: [
              {
                id: "7e1346d0-0157-4121-8545-c419599d5ff0",
                month: 2,
                tax_amount: 2200,
              },
              {
                id: "d7fcc9d1-d6d6-4e30-bb39-d062fbb110f6",
                month: 4,
                tax_amount: 2400,
              },
              {
                id: "53671df7-243e-4e73-b801-5657f5d161af",
                month: 5,
                tax_amount: 2500,
              },
              {
                id: "47aae1c7-ccfe-4f9d-830c-9ea14fe5a20a",
                month: 12,
                tax_amount: 2000,
              },
            ],
          },
        ],
      },
    },
    { status: 201 }
  );
}
