import { NextRequest, NextResponse } from "next/server";
import { isCorrectPassword, loginResponse } from "@/lib/adminAuth";
import { asRecord } from "@/lib/blogUtils";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/login {password} -> sets the mqt_admin cookie, or
 * 401 on wrong password. 503 when ADMIN_PASSWORD is not configured.
 */
export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD not configured" },
      { status: 503 },
    );
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const password = asRecord(body)?.password;
  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }
  if (!isCorrectPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  return loginResponse();
}
