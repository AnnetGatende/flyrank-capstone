import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const customerCount = await prisma.customer.count();

    return Response.json({
      ok: true,
      timestamp: new Date().toISOString(),
      customerCount,
    });
  } catch (error) {
    console.error("Keep-alive error:", error);
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Database ping failed",
      },
      { status: 500 }
    );
  }
}
