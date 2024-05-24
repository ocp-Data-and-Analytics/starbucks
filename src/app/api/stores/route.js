import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");

  // Sample store data, replace with your data source
  const stores = [
    { name: "Store 1", latitude: parseFloat(latitude) - 0.01, longitude: parseFloat(longitude) - 0.01 },
    { name: "Store 2", latitude: parseFloat(latitude) + 0.01, longitude: parseFloat(longitude) + 0.01 },
  ];

  return new Response(JSON.stringify(stores), {
    headers: { "Content-Type": "application/json" },
  });
}
