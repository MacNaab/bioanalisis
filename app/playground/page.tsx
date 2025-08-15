// app/analyses/liste/page.tsx
import ListeAnalyses from "@/components/playground/page";

export const metadata = {
  title: "Mes analyses biomédicales",
  description:
    "Accédez à l'historique de vos analyses statistiques, explorez les données.",
};

export default function Page() {
  return <ListeAnalyses />;
}
