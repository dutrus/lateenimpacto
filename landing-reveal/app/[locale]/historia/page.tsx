import { getDictionary } from "@/lib/i18n/dictionaries"
import HistoriaPage from "@/components/pages/historia"

export default async function Historia({ params }: { params: { locale: string } }) {
  const dictionary = await getDictionary(params.locale)

  return <HistoriaPage dictionary={dictionary} />
}
