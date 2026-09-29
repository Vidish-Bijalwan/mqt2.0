import { logoutResponse } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

/** POST /api/admin/logout -> clears the mqt_admin cookie. */
export async function POST() {
  return logoutResponse();
}
