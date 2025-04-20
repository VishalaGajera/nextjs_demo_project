import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Business locations listed successfully.",
      data: {
        totalPages: 1,
        currentPage: 1,
        totalCount: 1,
        businessUnitLocations: [
          {
            id: "db100da8-ecbb-4f30-ab2c-124040b3cff1",
            business_unit_id: "f15bec4d-86ab-4601-a4e9-b91c184466b4",
            business_unit_name: "demo",
            location_name: "Samsung Enterprises",
            email: "demo@gmail.com",
            phone_no: null,
            mobile_no: null,
            address: "1234 Samsung St, Suite 100",
            city_id: null,
            city_name: null,
            state_id: null,
            state_name: null,
            country_id: null,
            country_name: null,
            pin_code: null,
            action_by: "Demo",
            action_at: "2024-07-16T09:31:44.881Z",
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
