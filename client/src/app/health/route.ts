// ? this endpoint is used as health check for the application
export async function GET() {
  return new Response("OK", { status: 200 });
}
