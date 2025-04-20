import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Leave plan listed successfully.",
      data: [
        {
          id: "a387f51d-23a5-44ca-b633-4d3ed32e68d0",
          leave_plan_name: "Holiday 2000",
          company_name: "Codezee",
          company_id: "a387f51d-23a5-44ca-b633-4d3ed32e68d0",
          year_cycle: "Jan - Dec",
        },
        {
          id: "adc6cd39-f781-4655-9417-62e4aa979078",
          leave_plan_name: "Holiday 2024",
          company_name: "Codezee",
          company_id: "a387f51d-23a5-44ca-b633-4d3ed32e68d0",
          year_cycle: "Jan - Dec",
        },
        {
          id: "15e0b49d-963d-48b5-b17c-b126f6cf695d",
          leave_plan_name: "Holiday 20000",
          company_name: "Codezee",
          company_id: "a387f51d-23a5-44ca-b633-4d3ed32e68d0",
          year_cycle: "Jan - Dec",
        },
        {
          id: "28d19eee-3995-432a-8cdd-ef3193d26119",
          leave_plan_name: "Holiday 2024",
          company_name: "Codezee",
          company_id: "a387f51d-23a5-44ca-b633-4d3ed32e68d0",
          year_cycle: "Jan - Dec",
        },
        {
          id: "98e5ed4d-a313-4508-b65b-f5eecab7e799",
          leave_plan_name: "QEDDASDADads",
          company_name: "Codezee",
          company_id: "a387f51d-23a5-44ca-b633-4d3ed32e68d0",
          year_cycle: "Jan - Dec",
        },
        {
          id: "ae493eca-507d-493c-9984-056e0626c120",
          leave_plan_name: "Holidays First",
          company_name: "Codezee",
          company_id: "a387f51d-23a5-44ca-b633-4d3ed32e68d0",
          year_cycle: "Jan - Dec",
        },
        {
          id: "8d251eb1-2057-4ecf-9151-58bf2926dd35",
          leave_plan_name: "Holiday 2024 Gujarat",
          company_name: "Codezee",
          company_id: "a387f51d-23a5-44ca-b633-4d3ed32e68d0",
          year_cycle: "Jan - Dec",
        },
        {
          id: "1d8092a1-dae2-4bdc-b436-a017e61ed819",
          leave_plan_name: "Holidays today",
          company_name: "Codezee",
          company_id: "a387f51d-23a5-44ca-b633-4d3ed32e68d0",
          year_cycle: "Jan - Dec",
        },
      ],
    },
    { status: 201 }
  );
}
