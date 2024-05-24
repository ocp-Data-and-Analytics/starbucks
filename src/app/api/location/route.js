import { NextResponse } from "next/server";
import snowflake from "snowflake-sdk";

export async function POST(request) {
  console.log("Received POST request");

  const { latitude, longitude, radius } = await request.json();
  console.log("Request data:", { latitude, longitude, radius });

  // Debug: Print the first three characters of each environment variable
  const envVariables = {
    account: process.env.NEXT_PUBLIC_SNOWFLAKE_ACCOUNT,
    username: process.env.NEXT_PUBLIC_SNOWFLAKE_USERNAME,
    password: process.env.NEXT_PUBLIC_SNOWFLAKE_PASSWORD,
    database: process.env.NEXT_PUBLIC_SNOWFLAKE_DATABASE,
    warehouse: process.env.NEXT_PUBLIC_SNOWFLAKE_WAREHOUSE,
  };

  for (const [key, value] of Object.entries(envVariables)) {
    const debugMessage = `${key}: ${value ? value.substring(0, 3) : "undefined"}`;
    console.log(debugMessage);
  }

  const connection = snowflake.createConnection(envVariables);

  console.log("Created Snowflake connection.");

  return new Promise((resolve) => {
    connection.connect((err, conn) => {
      if (err) {
        console.log("Error connecting to Snowflake:", err.message);
        resolve(
          new NextResponse(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          })
        );
        return;
      }

      console.log("Connected to Snowflake");

      const query = `
        SELECT LOCATION_NAME as NAME, street_address as STREET, city as CITY, region as REGION, Phone_number as PHONE, latitude, longitude
        FROM PUBLIC.CORE_POI
        WHERE ST_DISTANCE(
            TO_GEOGRAPHY(ST_POINT(longitude, latitude)),
            TO_GEOGRAPHY(ST_POINT(${longitude}, ${latitude}))
        ) <= ${radius} * 1609.34;
      `;

      console.log("Executing query:", query);

      connection.execute({
        sqlText: query,
        complete: (err, stmt, rows) => {
          connection.destroy();

          if (err) {
            console.error("Error executing query:", err.message);
            resolve(
              new NextResponse(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
              })
            );
            return;
          }

          console.log("Query executed successfully, number of rows:", rows.length);

          const locations = rows.map((row) => ({
            name: row.NAME,
            street: row.STREET,
            city: row.CITY,
            state: row.REGION,
            phone: row.PHONE,
            latitude: row.LATITUDE,
            longitude: row.LONGITUDE,
          }));

          // console.log("Locations data:", locations);

          resolve(
            new NextResponse(JSON.stringify(locations), {
              headers: { "Content-Type": "application/json" },
            })
          );
        },
      });
    });
  });
}
