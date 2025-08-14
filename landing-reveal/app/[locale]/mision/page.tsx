import { getDictionary } from "@/lib/i18n/dictionaries"
import MisionPage from "@/components/pages/mision"

export default async function Mision({ params }: { params: { locale: string } }) {
  const dictionary = await getDictionary(params.locale)

  return <MisionPage dictionary={dictionary} />
}
