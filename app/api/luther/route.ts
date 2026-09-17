import { generateLuther } from "@/lib/generate";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, message: "Requête illisible." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text : "";
  const result = await generateLuther(text);
  const status = result.ok ? 200 : 422;
  return Response.json(result, { status });
}
