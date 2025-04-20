import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Leave types listed successfully.",
      data: [
        {
          id: "a387f51d-23a5-44ca-b633-4d3ed32e68d0",
          leave_type_name: "Holiday 2000",
          yearly_quota: 10,
          is_setup_completed: false,
        },
        {
          id: "adc6cd39-f781-4655-9417-62e4aa979078",
          leave_type_name: "Holiday 2024",
          yearly_quota: 10,
          is_setup_completed: false,
        },
        {
          id: "15e0b49d-963d-48b5-b17c-b126f6cf695d",
          leave_type_name: "Holiday 20000",
          yearly_quota: 5,
          is_setup_completed: true,
        },
        {
          id: "28d19eee-3995-432a-8cdd-ef3193d26119",
          leave_type_name: "Holiday 2024",
          yearly_quota: 10,
          is_setup_completed: false,
        },
        {
          id: "98e5ed4d-a313-4508-b65b-f5eecab7e799",
          leave_type_name: "QEDDASDADads",
          yearly_quota: 10,
          is_setup_completed: false,
        },
        {
          id: "ae493eca-507d-493c-9984-056e0626c120",
          leave_type_name: "Holidays First",
          yearly_quota: 10,
          is_setup_completed: false,
        },
        {
          id: "8d251eb1-2057-4ecf-9151-58bf2926dd35",
          leave_type_name: "Holiday 2024 Gujarat",
          yearly_quota: 10,
          is_setup_completed: false,
        },
        {
          id: "1d8092a1-dae2-4bdc-b436-a017e61ed819",
          leave_type_name: "Holidays today",
          yearly_quota: 10,
          is_setup_completed: true,
        },
      ],
    },
    { status: 201 }
  );
}
