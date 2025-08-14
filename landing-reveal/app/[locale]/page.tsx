import { getDictionary } from "@/lib/i18n/dictionaries"
import HomePage from "@/components/pages/home"

export default async function Home({ params }: { params: { locale: string } }) {
  const dictionary = await getDictionary(params.locale)

  return <HomePage dictionary={dictionary} />
}
