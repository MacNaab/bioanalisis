// app/analyses/nouveau/page.tsx
import NouvelleAnalyse from "@/components/nouveau/page";

export const metadata = {
  title: "Importer une nouvelle analyse",
  description:
    "Importez vos fichiers Excel et créez de nouvelles analyses biostatistique. Visualisation immédiate des données et préparation pour les analyses statistiques.",
};

export default function Page() {
  return <NouvelleAnalyse />;
}
