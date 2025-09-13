/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  FileSpreadsheet,
  Zap,
  Shield,
  Hospital,
  Microscope,
  TrendingUp,
  Download,
  PieChart,
  ArrowRight,
  CheckCircle,
  PlayCircle,
  FileText,
  Mail,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Database,
  Clock,
  Globe,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  const features = [
    {
      icon: FileSpreadsheet,
      title: "Import Excel simplifié",
      description:
        "Analysez directement vos fichiers cliniques existants sans conversion ni préparation complexe",
    },
    {
      icon: Zap,
      title: "Résultats instantanés",
      description:
        "Visualisations interactives et rapports statistiques générés automatiquement en quelques secondes",
    },
    {
      icon: Shield,
      title: "Confidentialité garantie",
      description:
        "Traitement 100% local dans votre navigateur - vos données ne quittent jamais votre machine",
    },
  ];

  const capabilities = [
    {
      icon: BarChart3,
      title: "Statistiques descriptives",
      items: [
        "Moyennes, médianes, écart-types",
        "Distributions et quartiles",
        "Tableaux de contingence",
      ],
    },
    {
      icon: PieChart,
      title: "Analyses comparatives",
      items: [
        "Tests de Chi-2",
        "Comparaisons de moyennes",
        "Analyses de variance",
      ],
    },
    {
      icon: Download,
      title: "Export professionnel",
      items: [
        "Rapports PDF formatés",
        "Tableaux Excel",
        "Graphiques haute définition",
      ],
    },
  ];

  const useCases = [
    {
      icon: Hospital,
      title: "Recherche clinique",
      description:
        "Comparez l'efficacité de traitements sur différents groupes de patients avec des tests statistiques robustes",
      tags: ["Essais cliniques", "Biostatistiques", "Analyse de cohortes"],
    },
    {
      icon: Microscope,
      title: "Études biomédicales",
      description:
        "Analysez l'évolution de marqueurs biologiques et identifiez des corrélations significatives dans vos données",
      tags: [
        "Marqueurs biologiques",
        "Analyses longitudinales",
        "Corrélations",
      ],
    },
    {
      icon: TrendingUp,
      title: "Épidémiologie",
      description:
        "Détectez des tendances et patterns dans vos données populationnelles pour orienter les politiques de santé",
      tags: ["Santé publique", "Surveillance", "Tendances"],
    },
  ];

  const compatibilityBadges = [
    { label: "Excel (.xlsx, .xls)", color: "bg-green-100 text-green-800" },
    { label: "CSV", color: "bg-blue-100 text-blue-800" },
    { label: "Jusqu'à 50Mo", color: "bg-purple-100 text-purple-800" },
    { label: "Chrome, Edge, Firefox", color: "bg-orange-100 text-orange-800" },
  ];

  const faqs = [
    {
      id: "data-storage",
      question: "Où sont stockées mes données ?",
      answer:
        "Toutes vos données sont traitées 100% localement dans votre navigateur. Aucune information n'est envoyée sur nos serveurs, garantissant une confidentialité totale.",
    },
    {
      id: "file-formats",
      question: "Quels formats de fichiers sont supportés ?",
      answer:
        "Notre plateforme accepte les fichiers Excel (.xlsx, .xls) et CSV jusqu'à 50Mo. Les données peuvent contenir du texte, des nombres et des dates.",
    },
    {
      id: "statistical-tests",
      question: "Quels tests statistiques sont disponibles ?",
      answer:
        "Nous proposons les tests essentiels : Chi-2, t-test, ANOVA, corrélations de Pearson, analyses descriptives complètes et bien plus selon vos données.",
    },
    {
      id: "export-options",
      question: "Comment exporter mes résultats ?",
      answer:
        "Exportez vos analyses sous forme de rapports PDF professionnels, tableaux Excel détaillés ou graphiques haute définition pour vos publications.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20" />
        <div className="container mx-auto px-6 pt-12 pb-24 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 px-4 py-2"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Solution biomédicale innovante
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold">
                Transformez vos données Excel en insights biomédicaux
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Solution clé en main pour l'analyse statistique de données
                cliniques. Obtenez des résultats professionnels en quelques
                clics, sans expertise technique requise.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/nouveau">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Commencer une analyse
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/exemples">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 border-2 hover:bg-muted/50 cursor-pointer"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Voir un exemple
                </Button>
              </Link>
            </div>

            {/* Compatibility badges */}
            <div className="flex flex-wrap gap-2 justify-center pt-4">
              {compatibilityBadges.map((badge, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={`${badge.color} px-3 py-1`}
                >
                  {badge.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Pourquoi choisir notre plateforme ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une approche moderne de l'analyse biostatistique, pensée pour les
              professionnels de santé
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary/20 hover:shadow-lg transition-all duration-300 group"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Fonctionnalités complètes
            </h2>
            <p className="text-lg text-muted-foreground">
              Tous les outils nécessaires pour vos analyses biostatistiques
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <Card
                key={index}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <capability.icon className="h-5 w-5 text-primary" />
                    </div>
                    {capability.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {capability.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Cas d'usage professionnels
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des solutions adaptées à chaque domaine de la recherche
              biomédicale
            </p>
          </div>

          <div className="space-y-8">
            {useCases.map((useCase, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-2 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mx-auto">
                        <useCase.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div className="md:col-span-7 space-y-3">
                      <h3 className="text-xl font-semibold">{useCase.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {useCase.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {useCase.tags.map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-3 text-center">
                      <Button variant="outline" className="w-full">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Voir exemple
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Questions fréquentes
              </h2>
              <p className="text-lg text-muted-foreground">
                Tout ce que vous devez savoir sur notre plateforme
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.id} className="overflow-hidden">
                  <Collapsible
                    open={openFaq === faq.id}
                    onOpenChange={() => toggleFaq(faq.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-left text-lg">
                            {faq.question}
                          </CardTitle>
                          {openFaq === faq.id ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-16 bg-background border-t">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-center mb-8">
              Spécifications techniques
            </h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <Database className="h-8 w-8 text-primary mx-auto" />
                <h4 className="font-medium">Formats supportés</h4>
                <p className="text-sm text-muted-foreground">
                  .xlsx, .xls, .csv
                </p>
              </div>
              <div className="space-y-2">
                <Clock className="h-8 w-8 text-primary mx-auto" />
                <h4 className="font-medium">Taille maximale</h4>
                <p className="text-sm text-muted-foreground">
                  50 Mo par fichier
                </p>
              </div>
              <div className="space-y-2">
                <Globe className="h-8 w-8 text-primary mx-auto" />
                <h4 className="font-medium">Navigateurs</h4>
                <p className="text-sm text-muted-foreground">
                  Chrome, Edge, Firefox
                </p>
              </div>
              <div className="space-y-2">
                <Shield className="h-8 w-8 text-primary mx-auto" />
                <h4 className="font-medium">Sécurité</h4>
                <p className="text-sm text-muted-foreground">100% local</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8 text-white">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Prêt à transformer vos données ?
            </h2>
            <p className="text-xl opacity-90 leading-relaxed">
              Rejoignez les professionnels de santé qui font confiance à notre
              plateforme pour leurs analyses biostatistiques critiques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/nouveau">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6 shadow-xl cursor-pointer"
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Démarrer maintenant
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-blue-600 border-white/30 text-white hover:bg-blue-900"
              >
                <Mail className="h-5 w-5 mr-2" />
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg">Evil Corp</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Plateforme d'analyse biostatistique moderne pour les
                professionnels de santé.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Ressources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/documentation"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/playground"
                    className="hover:text-foreground transition-colors"
                  >
                    Tutoriels
                  </Link>
                </li>
                <li>
                  <Link
                    href="/exemples"
                    className="hover:text-foreground transition-colors"
                  >
                    Exemples
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Centre d'aide
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Signaler un bug
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Mentions légales
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Evil Corp. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                v0.1.0
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
