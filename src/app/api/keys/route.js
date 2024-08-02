import fs from "fs";
import path from "path";

export async function GET(request) {
  const filePath = path.join(process.cwd(), "src", "data", "info.txt");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const [key, value] = fileContent.split(",");

  return new Response(JSON.stringify({ [key]: value }), {
    headers: { "Content-Type": "application/json" },
  });
}
