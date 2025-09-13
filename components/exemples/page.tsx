/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
  FlaskConical,
  Calendar,
  Users,
  BarChart3,
  Download,
  Play,
  ArrowRight,
  Database,
  Info,
  Zap,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function ExamplesPage() {
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const examples = [
    {
      id: "longitudinal-study",
      title: "Étude 1 - Évolution sur 3 ans",
      category: "Analyse temporelle",
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description:
        "Analyse de l'ensemble des données pour les annéees 2023, 2024 et 2025 concernant le mois d'avril.",
      dataStructure: {
        rows: 2939,
        columns: 10,
      },
    },
    {
      id: "comparative-study",
      title: "Étude 2 - 2 groupes indépendants",
      category: "Analyse comparative",
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      description:
        "Répartition des données par période de Date Médecin Traitant. Période1 du 01/03/2023 - 31/03/2024 et Période2 du 01/04/2024 - 30/04/2025.",
      dataStructure: {
        rows: 1762,
        columns: 10,
        variables: [
          {
            name: "Date",
            type: "Identifiant",
            example: "2023-04-01, 2024-04-01...",
          },
          { name: "Age", type: "Quantitative", example: "45, 52, 67..." },
          { name: "Sexe", type: "Qualitative", example: "Homme, Femme" },
          {
            name: "Departement",
            type: "Qualitative",
            example: "18, 36, 45...",
          },
          {
            name: "Ville",
            type: "Qualitative",
            example: "VIERZON, SALBRIS...",
          },
          { name: "ALD", type: "Qualitative", example: "Oui, Non" },
          {
            name: "Complementaire",
            type: "Qualitative",
            example: "C2S, AME",
          },
          { name: "MedecinTraitant", type: "Qualitative", example: "Oui, Non" },
          {
            name: "DateMedecinTraitant",
            type: "Identifiant",
            example: "2023-04-01, 2024-04-01...",
          },
          {
            name: "Consultation1",
            type: "Quantitative",
            example: "1, 2...",
          },
          {
            name: "Consultation2",
            type: "Quantitative",
            example: "1, 2...",
          },
        ],
      },
    },
  ];

  const handleExampleSelect = (exampleId: string) => {
    setSelectedExample(exampleId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 border-b">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FlaskConical className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Exemples d'analyses
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez des cas d'usage concrets avec des données réelles.
              Explorez nos analyses biostatistiques et reproduisez-les avec vos
              propres données.
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Analyses temporelles
              </Badge>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 px-4 py-2"
              >
                <Users className="h-4 w-4 mr-2" />
                Comparaisons de groupes
              </Badge>
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 border-purple-200 px-4 py-2"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Données réelles anonymisées
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Alert className="border-blue-200 bg-blue-50 mb-8">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Données d'exemple :</strong> Tous les datasets présentés
                utilisent des données anonymisées conformes aux standards RGPD.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
              {examples.map((example, index) => (
                <Link href={`/exemples/${index + 1}`} target="_blank" key={uuidv4()}>
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    example.borderColor
                  } ${
                    selectedExample === example.id
                      ? "ring-2 ring-primary/50 shadow-lg"
                      : ""
                  }`}
                  onClick={() => handleExampleSelect(example.id)}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 ${example.bgColor} rounded-xl flex items-center justify-center`}
                      >
                        <example.icon
                          className={`h-6 w-6 text-${
                            example.color.split("-")[1]
                          }-600`}
                        />
                      </div>
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-2">
                          {example.category}
                        </Badge>
                        <CardTitle className="text-lg leading-tight">
                          {example.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed mb-4">
                      {example.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Database className="h-4 w-4" />
                        {example.dataStructure.rows} observations
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Examples */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            {examples.map((example, index) => (
              <div key={uuidv4()} className="space-y-8">
                {/* Example Header */}
                <div className="text-center space-y-4">
                  <div
                    className={`w-16 h-16 ${example.bgColor} rounded-2xl flex items-center justify-center mx-auto`}
                  >
                    <example.icon
                      className={`h-8 w-8 text-${
                        example.color.split("-")[1]
                      }-600`}
                    />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">
                    {example.title}
                  </h2>
                  <p className="text-muted-foreground max-w-3xl mx-auto">
                    {example.description}
                  </p>
                </div>

                {/* Example Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Context & Data Structure */}
                  <div className="lg:col-span-1 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="h-5 w-5" />
                          Structure des données
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <div className="text-2xl font-bold text-primary">
                                {example.dataStructure.rows}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Lignes
                              </div>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <div className="text-2xl font-bold text-primary">
                                {example.dataStructure.columns}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Variables
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Analyses & Results */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Résultats de l'analyse
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <Link href={`/exemples/${index + 1}`}>
                            <Button
                              className="gap-2 h-12 cursor-pointer"
                              size="lg"
                            >
                              <Play className="h-5 w-5" />
                              Analyser cet exemple
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            className="gap-2 h-12"
                            size="lg"
                          >
                            <Download className="h-5 w-5" />
                            Télécharger les données
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {index < examples.length - 1 && <Separator className="my-16" />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
