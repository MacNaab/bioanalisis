/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  FileSpreadsheet,
  Play,
  Settings,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  analysis,
  baseCaracteristics,
  globalAnalysis,
} from "@/lib/biostatistics";
import SubAnalyseCard from "@/components/biostatistics/subanalyseCard";
import BrutCard from "@/components/biostatistics/brutCard";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { toast } from "sonner";

export default function BiostatisticsPage({
  analysisConfig,
}: {
  analysisConfig: any | null;
}) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);


  // États pour l'analyse biostatistique
  const sheetDataCollection = analysisConfig.data;
  const [primaryCharacteristic, setPrimaryCharacteristic] =
    useState<string>("");
  const [secondaryCharacteristics, setSecondaryCharacteristics] = useState<
    string[]
  >([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    // Simulation d'un délai d'analyse
    setTimeout(() => {
      try {
        const results: any = {};
        analysisConfig?.sheets.forEach((sheetName: string) => {
          const sheetData = sheetDataCollection[sheetName];
          results[sheetName as string] = analysis(
            sheetName,
            sheetData,
            primaryCharacteristic,
            secondaryCharacteristics
          );
        });
        results["Global"] = globalAnalysis(
          analysisConfig?.sheets ?? [],
          // Object.values(sheetDataCollection).flat(),
          sheetDataCollection,
          primaryCharacteristic,
          secondaryCharacteristics
        );
        setAnalysisResults(results);
        setIsAnalyzing(false);
        toast.success("Analyse terminée.");
      } catch (error) {
        toast.error(`Une erreur s'est produite lors de l'analyse :\n${error}`);
        console.error("Error parsing Excel data:", error);
        setIsAnalyzing(false);
      }
    }, 1000);
  };

  const handleSecondaryCharacteristicChange = (
    characteristicName: string,
    checked: boolean
  ) => {
    if (checked) {
      setSecondaryCharacteristics([
        ...secondaryCharacteristics,
        characteristicName,
      ]);
    } else {
      setSecondaryCharacteristics(
        secondaryCharacteristics.filter((name) => name !== characteristicName)
      );
    }
  };

  const canAnalyze =
    primaryCharacteristic && secondaryCharacteristics.length > 0;

  if (!analysisConfig || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement de l'analyse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      {/* En-tête avec informations de l'analyse */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Analyse biostatistique
            </h1>
            <p className="text-xl text-muted-foreground">
              {analysisConfig.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {analysisConfig.description}
            </p>
          </div>
        </div>

        {/* Informations sur les données */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-around gap-2">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Données chargées
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisConfig.sheets.map((sheetName: string) => (
                  <Badge
                    key={uuidv4()}
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    {sheetName}
                  </Badge>
                ))}
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Résultats bruts */}
      <Card>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer px-2">
              <CardHeader className="w-full">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Résultats bruts
                </CardTitle>
                <CardDescription className="text-left">
                  Visualisation et statistiques bruts des données
                </CardDescription>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent className="mt-2 space-y-4">
              <CardContent>
                <BrutCard
                  brutResults={sheetDataCollection}
                  sheetsNames={analysisConfig.sheets}
                />
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Configuration de l'analyse */}
      <Card id="data-info">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration de l'analyse
          </CardTitle>
          <CardDescription>
            Sélectionnez les caractéristiques à analyser pour votre étude
            biostatistique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Caractéristique principale */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Caractéristique principale
            </Label>
            <Select
              value={primaryCharacteristic}
              onValueChange={(value) => {
                setPrimaryCharacteristic(value);
                // vérifier que la valeur ne fait pas partie des secondaryCharacteristics,
                // sinon la supprimer de secondaryCharacteristics
                if (secondaryCharacteristics.includes(value)) {
                  setSecondaryCharacteristics(
                    secondaryCharacteristics.filter((name) => name !== value)
                  );
                }
              }}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Sélectionnez la caractéristique principale" />
              </SelectTrigger>
              <SelectContent>
                {baseCaracteristics
                  .filter((caracteristic) => caracteristic.options)
                  .map((caracteristic) => (
                    <SelectItem key={uuidv4()} value={caracteristic.name}>
                      {caracteristic.name}
                    </SelectItem>
                  ))}
                <SelectItem value="Catégories d'âge">
                  Catégories d'âge
                </SelectItem>
              </SelectContent>
            </Select>
            {primaryCharacteristic && (
              <Badge variant="outline" className="w-fit">
                Sélectionné : {primaryCharacteristic}
              </Badge>
            )}
          </div>

          <Separator />

          {/* Caractéristiques secondaires */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Caractéristiques secondaires
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {baseCaracteristics.map((caracteristic) => (
                <div
                  key={uuidv4()}
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={caracteristic.name}
                    checked={secondaryCharacteristics.includes(
                      caracteristic.name
                    )}
                    onCheckedChange={(checked) =>
                      handleSecondaryCharacteristicChange(
                        caracteristic.name,
                        checked as boolean
                      )
                    }
                    disabled={caracteristic.name === primaryCharacteristic}
                  />
                  <Label
                    htmlFor={caracteristic.name}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {caracteristic.name}
                  </Label>
                </div>
              ))}
            </div>

            {/* Résumé des sélections */}
            {secondaryCharacteristics.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {secondaryCharacteristics.length} caractéristique
                  {secondaryCharacteristics.length > 1 ? "s " : " "}
                  sélectionnée{secondaryCharacteristics.length > 1 ? "s" : ""} :
                </p>
                <div className="flex flex-wrap gap-2">
                  {secondaryCharacteristics.map((char) => (
                    <Badge key={uuidv4()} variant="secondary">
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Bouton d'analyse */}
          <div className="flex items-center justify-between">
            <div>
              {!canAnalyze && (
                <Alert variant="destructive" className="w-fit">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Sélectionnez au moins une caractéristique principale et une
                    secondaire
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <Button
              onClick={startAnalysis}
              disabled={!canAnalyze || isAnalyzing}
              size="lg"
              className="min-w-32 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyse...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Analyser
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultats de l'analyse */}
      {analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Résultats de l'analyse
            </CardTitle>
            <CardDescription>
              Visualisation et statistiques pour chaque feuille de données
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={analysisConfig.sheets[0]} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                {analysisConfig.sheets.map((sheetName: string) => (
                  <TabsTrigger
                    key={uuidv4()}
                    value={sheetName}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer"
                  >
                    {sheetName}
                  </TabsTrigger>
                ))}
                <TabsTrigger
                  value="Global"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer"
                >
                  Global
                </TabsTrigger>
              </TabsList>
              {analysisConfig.sheets.map((sheetName: string) => (
                <TabsContent
                  key={uuidv4()}
                  value={sheetName}
                  className="space-y-6"
                >
                  <SubAnalyseCard
                    analysisResults={analysisResults[sheetName]}
                    sheetName={sheetName}
                  />
                </TabsContent>
              ))}
              <TabsContent value="Global" className="space-y-6">
                <SubAnalyseCard
                  analysisResults={analysisResults["Global"]}
                  sheetsNames={analysisConfig.sheets}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <ScrollToTopButton targetId="data-info" />
    </div>
  );
}
