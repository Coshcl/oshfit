import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Esta API está desactivada" }, { status: 403 });
}
