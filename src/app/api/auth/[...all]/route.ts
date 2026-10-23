import { getAuth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handle(request: Request) {
  try {
    const auth = await getAuth();
    const response = await auth.handler(request);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    // Do not log database errors, connection strings, credentials, or request bodies.
    console.error("Authentication service unavailable.");
    return Response.json({ message: "Authentication is temporarily unavailable. Please try again." }, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}

export const GET = handle;
export const POST = handle;
