// app/exemples/[id]/page.tsx
import analyse from "./analyse.json";
import BiostatisticsPage from "@/components/exemples/biostatistics";

export async function generateMetadata() {
  return {
    title: "Exemple d'analyse biostatistique",
    description:
      "Résultats détaillés de l'analyse statistique : statistiques descriptives, comparaisons de groupes, visualisations interactives et export des résultats.",
  };
}

export default function Page() {
  return <BiostatisticsPage analysisConfig={analyse} />;
}
