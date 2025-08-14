import { type NextRequest, NextResponse } from "next/server"
import { getDictionary } from "@/lib/i18n/dictionaries"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const locale = searchParams.get("locale") || "es"

  try {
    const dictionary = await getDictionary(locale)
    return NextResponse.json(dictionary)
  } catch (error) {
    return NextResponse.json({ error: "Failed to load dictionary" }, { status: 500 })
  }
}
