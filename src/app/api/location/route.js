import { NextResponse } from "next/server";
import snowflake from "snowflake-sdk";

export async function POST(request) {
  const { latitude, longitude, radius } = await request.json();

  const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USERNAME,
    password: process.env.SNOWFLAKE_PASSWORD,
    database: process.env.SNOWFLAKE_DATABASE,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  });

  return new Promise((resolve) => {
    connection.connect((err, conn) => {
      if (err) {
        console.error("Error connecting to Snowflake:", err.message);
        resolve(
          new NextResponse(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          })
        );
        return;
      }

      const query = `
        SELECT LOCATION_NAME as NAME, street_address as STREET, city as CITY, region as REGION, Phone_number as PHONE, latitude, longitude
        FROM PUBLIC.CORE_POI
        WHERE ST_DISTANCE(
            TO_GEOGRAPHY(ST_POINT(longitude, latitude)),
            TO_GEOGRAPHY(ST_POINT(${longitude}, ${latitude}))
        ) <= ${radius} * 1609.34;
      `;

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

          const locations = rows.map((row) => ({
            name: row.NAME,
            street: row.STREET,
            city: row.CITY,
            state: row.REGION,
            phone: row.PHONE,
            latitude: row.LATITUDE,
            longitude: row.LONGITUDE,
          }));

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
