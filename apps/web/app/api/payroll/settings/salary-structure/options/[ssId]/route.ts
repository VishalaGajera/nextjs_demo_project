import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Salary structures fetched successfully",
    data: [
      {
        options: {
          label: "General Structure",
          value: {
            monthly: {
              ranges: [
                {
                  label: { from_range: 10000, to_range: 20000 },
                  value: "monthly_range_1",
                },
                {
                  label: { from_range: 20001, to_range: 30000 },
                  value: "monthly_range_2",
                },
              ],
              custom: [
                { label: "Manager Monthly", value: "manager_monthly" },
                { label: "Executive Monthly", value: "executive_monthly" },
              ],
            },
            daily: {
              ranges: [
                {
                  label: { from_range: 500, to_range: 1000 },
                  value: "daily_range_1",
                },
                {
                  label: { from_range: 1001, to_range: 1500 },
                  value: "daily_range_2",
                },
              ],
              custom: [
                { label: "Part-time Daily", value: "parttime_daily" },
                { label: "Consultant Daily", value: "consultant_daily" },
              ],
            },
            hourly: {
              ranges: [
                {
                  label: { from_range: 50, to_range: 100 },
                  value: "hourly_range_1",
                },
                {
                  label: { from_range: 101, to_range: 150 },
                  value: "hourly_range_2",
                },
              ],
              custom: [
                { label: "Support Staff Hourly", value: "support_hourly" },
                { label: "Intern Hourly", value: "intern_hourly" },
              ],
            },
            annually: {
              ranges: [
                {
                  label: { from_range: 120000, to_range: 240000 },
                  value: "annual_range_1",
                },
                {
                  label: { from_range: 240001, to_range: 360000 },
                  value: "annual_range_2",
                },
              ],
              custom: [
                { label: "Executive Annual", value: "executive_annual" },
                { label: "Director Annual", value: "director_annual" },
              ],
            },
          },
        },
      },
      {
        options: {
          label: "Tech Department Structure",
          value: {
            monthly: {
              ranges: [
                {
                  label: { from_range: 25000, to_range: 40000 },
                  value: "tech_monthly_range_1",
                },
              ],
              custom: [
                { label: "Developer Monthly", value: "developer_monthly" },
              ],
            },
            daily: {
              ranges: [],
              custom: [],
            },
            hourly: {
              ranges: [],
              custom: [
                { label: "Freelancer Hourly", value: "freelancer_hourly" },
              ],
            },
            annually: {
              ranges: [],
              custom: [],
            },
          },
        },
      },
    ],
  });
}
