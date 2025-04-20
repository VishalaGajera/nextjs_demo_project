import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Leave balance summary employee listed successfully",
      data: {
        totalCount: 2,
        list: [
          {
            id: "e5c4d4ff-9e5e-4420-b441-d8895fa6866f",
            employee_code: "RK5RK",
            punch_code: null,
            avatar: null,
            employee_name: "Vishwa Rathore",
            department_name: "ACCOUNT",
            sub_department_name: "HUMAN & RESOURCEs",
            designation_name: "VP HR HEAD",
            reporting_manager_name: "Ravina Rajput",
            leave_plan_name: "Standard Leave Plan",
            leave_balance: [
              {
                quota_type: "limited",
                annual_quota: 12,
                leave_type_id: "3c53112b-3b77-4d9a-be3e-499749b8e361",
                available_balance: 12,
              },
              {
                quota_type: "limited",
                annual_quota: 12,
                leave_type_id: "2372e1ae-4bff-46c3-9add-e692abe6b73b",
                available_balance: 12,
              },
              {
                quota_type: "limited",
                annual_quota: 12,
                leave_type_id: "260265de-cf7c-4bc1-8a99-b300b050f8b4",
                available_balance: 12,
              },
              {
                quota_type: "limited",
                annual_quota: 12,
                leave_type_id: "cd0e7338-7447-4e69-8dae-db6a72c3f21c",
                available_balance: 12,
              },
            ],
            full_count: "4",
          },
          {
            id: "9ab8b1b4-6852-436f-b39d-7214c857d023",
            employee_code: "RK4RK",
            punch_code: "3110",
            avatar: null,
            employee_name: "Serena Yates Bruce Caldwell",
            department_name: "ACCOUNT",
            sub_department_name: "HUMAN & RESOURCEs",
            designation_name: "VP HR HEAD",
            reporting_manager_name: "Ravina Rajput",
            leave_plan_name: "Standard Leave Plan",
            leave_balance: [
              {
                quota_type: "limited",
                annual_quota: 12,
                leave_type_id: "3c53112b-3b77-4d9a-be3e-499749b8e361",
                available_balance: 12,
              },
              {
                quota_type: "limited",
                annual_quota: 12,
                leave_type_id: "2372e1ae-4bff-46c3-9add-e692abe6b73b",
                available_balance: 12,
              },
              {
                quota_type: "limited",
                annual_quota: 12,
                leave_type_id: "260265de-cf7c-4bc1-8a99-b300b050f8b4",
                available_balance: 12,
              },
              {
                quota_type: "limited",
                annual_quota: 12,
                leave_type_id: "cd0e7338-7447-4e69-8dae-db6a72c3f21c",
                available_balance: 12,
              },
            ],
            full_count: "4",
          },
        ],
      },
    },
    { status: 200 }
  );
}
