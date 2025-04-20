import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Personal information retrieved successfully.",
      data: {
        id: "85080832-ef27-466d-9534-fad00e11c5c6",
        employee_id: "2137cb32-f380-44fe-ac61-ed891a1313a3",
        place_of_birth: "New York",
        blood_group: "o+",
        marital_status: "married",
        nationality: "indian",
        marriage_date: "2020-06-14T18:30:00.000Z",
        religion: "hinduism",
        father_name: "John Do",
        spouse_name: "Jane Doe",
        is_physically_challenged: false,
        identity_mark: "Scar on left cheek",
        caste: "brahmin",
        sub_caste_id: "64df2a27-9970-46ae-ad00-3cbc560fd023",
        sub_caste_name: "Patel",
        action_by: "Demo",
        action_at: "2024-08-12T03:34:58.841Z",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Personal information updated successfully.",
      data: {
        id: "85080832-ef27-466d-9534-fad00e11c5c6",
        employee_id: "2137cb32-f380-44fe-ac61-ed891a1313a3",
        place_of_birth: "New York",
        blood_group: "o+",
        marital_status: "married",
        marriage_date: "2020-06-14T18:30:00.000Z",
        nationality: "indian",
        religion: "hinduism",
        father_name: "John Doe",
        spouse_name: "Jane Doe",
        is_physically_challenged: false,
        identity_mark: "Scar on left cheek",
        caste: "brahmin",
        sub_caste_id: "64df2a27-9970-46ae-ad00-3cbc560fd023",
        created_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        updated_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        created_at: "2024-08-12T03:33:36.285Z",
        updated_at: "2024-08-12T03:33:36.285Z",
      },
    },
    { status: 200 }
  );
}
