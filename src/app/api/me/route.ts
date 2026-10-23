import { getAuth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const headers = { "Cache-Control": "private, no-store" };
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return Response.json({ message: "Unauthorized" }, { status: 401, headers });
    return Response.json({
      user: { id: session.user.id, username: session.user.name, email: session.user.email },
    }, { headers });
  } catch {
    return Response.json({ message: "Account access is temporarily unavailable." }, { status: 503, headers });
  }
}
