// app/biostatistics/[id]/page.tsx
import BiostatisticsPage from "@/components/biostatistics/page";

export async function generateMetadata() {
  return {
    title: "Analyse biostatistique",
    description:
      "Résultats détaillés de l'analyse statistique : statistiques descriptives, comparaisons de groupes, visualisations interactives et export des résultats.",
  };
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  // const { id } = use(params);
  return <BiostatisticsPage params={params} />;
}
