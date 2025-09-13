/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import Link from "next/link";

import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Database,
  BarChart3,
  Download,
  Play,
  Info,
  FileCheck,
  Clock,
  Users,
  Target,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { DataTable } from "@/components/DataTable";
import {
  saveAnalysis as saveAnalysisIDB,
  getKeys as getKeysIDB,
} from "@/lib/idb";
import { Analysis } from "@/types/analysis";

export default function ImprovedAnalysisForm() {
  const [file, setFile] = useState<File | null>(null);
  const [analysisName, setAnalysisName] = useState("");
  const [parsedData, setParsedData] = useState<Record<string, any[]>>({});
  const [currentSheet, setCurrentSheet] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDataPreview, setShowDataPreview] = useState(false);

  const handleFileUpload = async (e: any) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setIsProcessing(true);
      setUploadProgress(0);

      // Simulation de traitement du fichier
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      const data = await uploadedFile.arrayBuffer();
      const workbook = XLSX.read(data);

      // Parse all sheets
      const sheetsData: Record<string, any[]> = {};
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        sheetsData[sheetName] = XLSX.utils.sheet_to_json(worksheet);
      });

      setParsedData(sheetsData);
      setCurrentSheet(workbook.SheetNames[0]);
    }
  };

  const createAnalysis = async (): Promise<Analysis> => {
    if (!file) throw new Error("No file selected");

    const workbook = XLSX.utils.book_new();
    // const worksheet = XLSX.utils.json_to_sheet(parsedData);
    const worksheet = XLSX.utils.json_to_sheet(Object.values(parsedData));
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const binaryString = XLSX.write(workbook, { type: "binary" });
    const data = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      data[i] = binaryString.charCodeAt(i);
    }

    const fileData = await file.arrayBuffer();

    return {
      id: crypto.randomUUID(),
      name: analysisName,
      fileName: file.name,
      sheets: Object.keys(parsedData),
      // data: data.buffer, // Assign the ArrayBuffer to the data property
      data: fileData, // Stockage du fichier brut
      createdAt: new Date(),
      metadata: {
        rowCounts: Object.fromEntries(
          Object.entries(parsedData).map(([sheet, data]) => [
            sheet,
            data.length,
          ])
        ),
        columns: Object.fromEntries(
          Object.entries(parsedData).map(([sheet, data]) => [
            sheet,
            data.length > 0 ? Object.keys(data[0]) : [],
          ])
        ),
      },
    };
  };

  const saveAnalysis = async () => {
    try {
      // Validation
      if (!file || !analysisName) {
        toast.error(
          "Veuillez sélectionner un fichier et donner un nom à l'analyse"
        );
        return;
      }

      // Création de l'objet analysis
      const analysis = await createAnalysis();

      // Vérification des doublons
      const existingKeys = await getKeysIDB();
      const duplicate = existingKeys.some(
        (key) =>
          typeof key === "string" &&
          key.includes(analysisName) &&
          key.startsWith("analysis_")
      );

      if (duplicate) {
        toast.error("Une analyse avec ce nom existe déjà");
        return;
      }

      // Sauvegarde dans IndexedDB
      await saveAnalysisIDB(analysis);

      // Feedback utilisateur
      toast(
        <div className="flex items-center justify-between gap-3 min-w-[300px] w-full">
          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-medium flex items-center justify-between">
              <span>Analyse prête</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {`Ajout de ${analysis.name}`}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {`${analysis.sheets.length} feuille${
                analysis.sheets.length > 1 ? "s" : ""
              } traitée${analysis.sheets.length > 1 ? "s" : ""}`}
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Link
              href={`/biostatistics/${analysis.id}`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              Voir
            </Link>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde", error);
      toast.error("Échec de la création", {
        description: "Une erreur est survenue lors de l'enregistrement",
      });
    }
  };

  const downloadAnalysis = async () => {
    try {
      // Validation
      if (!file || !analysisName) {
        toast.error(
          "Veuillez sélectionner un fichier et donner un nom à l'analyse"
        );
        return;
      }

      // Création de l'objet analysis
      const analysis: any = await createAnalysis();
      analysis.data = parsedData;

      // créer un fichier json
      const json = JSON.stringify(analysis, null, 2);
      // télécharger le fichier json
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${analysisName}.json`;
      link.click();
      URL.revokeObjectURL(url);

      // Feedback utilisateur
      toast.success(`${analysisName}.json créé avec succès`);
    } catch (error) {
      console.error("Erreur lors de la création du fichier", error);
      toast.error("Échec de la création", {
        description: "Une erreur est survenue lors de la génération du fichier",
      });
    }
  };

  const fileSize = file ? (file.size / (1024 * 1024)).toFixed(2) : 0;
  const isValidFile = file && file.size <= 50 * 1024 * 1024; // 50MB limit
  const canProceed =
    file && analysisName.trim() && Object.keys(parsedData).length > 0;

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Nouvelle analyse biomédicale
            </h1>
            <p className="text-muted-foreground">
              Importez vos données Excel et configurez votre analyse statistique
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              file ? "bg-primary text-white" : "bg-muted border-2 border-dashed"
            }`}
          >
            {file ? <CheckCircle2 className="h-4 w-4" /> : "1"}
          </div>
          <span
            className={`text-sm font-medium ${
              file ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Import
          </span>
        </div>
        <div className="flex-1 h-2 bg-muted rounded-full">
          <div
            className="h-2 bg-primary rounded-full transition-all duration-300"
            style={{ width: file ? (canProceed ? "100%" : "50%") : "0%" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              canProceed
                ? "bg-primary text-white"
                : "bg-muted border-2 border-dashed"
            }`}
          >
            {canProceed ? <CheckCircle2 className="h-4 w-4" /> : "2"}
          </div>
          <span
            className={`text-sm font-medium ${
              canProceed ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Configuration
          </span>
        </div>
      </div>

      {/* File Upload Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import de données
          </CardTitle>
          <CardDescription>
            Sélectionnez votre fichier Excel contenant les données à analyser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              file
                ? "border-green-200 bg-green-50"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
            }`}
          >
            <label htmlFor="dropzone-file" className="cursor-pointer">
              <div className="space-y-4">
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                    file ? "bg-green-100" : "bg-muted/50"
                  }`}
                >
                  {file ? (
                    <FileCheck className="h-8 w-8 text-green-600" />
                  ) : (
                    <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>

                {file ? (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-green-700">
                      Fichier importé avec succès
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{file.name}</p>
                      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                        <span>{fileSize} MB</span>
                        <Badge
                          variant={isValidFile ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {isValidFile
                            ? "Taille validée"
                            : "Fichier trop volumineux"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="font-semibold">
                      Glissez-déposez votre fichier Excel ici
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ou cliquez pour parcourir vos fichiers
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline">.xlsx</Badge>
                      <Badge variant="outline">.xls</Badge>
                      <Badge variant="outline">Max 50MB</Badge>
                    </div>
                  </div>
                )}
              </div>

              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Processing Progress */}
          {isProcessing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Traitement du fichier...
                </span>
                <span className="text-sm text-muted-foreground">
                  {uploadProgress}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* File Validation */}
          {file && (
            <Alert
              className={
                isValidFile
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }
            >
              {isValidFile ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription
                className={isValidFile ? "text-green-800" : "text-red-800"}
              >
                {isValidFile
                  ? `Fichier valide : ${file.name} (${fileSize} MB)`
                  : "Fichier trop volumineux. La taille maximale autorisée est de 50 MB."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Analysis Configuration */}
      {file && isValidFile && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Configuration de l'analyse
            </CardTitle>
            <CardDescription>
              Donnez un nom à votre analyse pour l'identifier facilement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="analysis-name" className="text-base font-medium">
                Nom de l'analyse
              </Label>
              <Input
                id="analysis-name"
                value={analysisName}
                onChange={(e) => setAnalysisName(e.target.value)}
                placeholder="Ex: Étude cohorte patients diabétiques 2024"
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">
                Choisissez un nom descriptif pour retrouver facilement votre
                analyse
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Preview */}
      {Object.keys(parsedData).length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Aperçu des données
                </CardTitle>
                <CardDescription>
                  Vérifiez la structure de vos données avant de continuer
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDataPreview(!showDataPreview)}
                className="gap-2"
              >
                {showDataPreview ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {showDataPreview ? "Masquer" : "Afficher"}
              </Button>
            </div>
          </CardHeader>

          <Collapsible open={showDataPreview} onOpenChange={setShowDataPreview}>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                {/* Data Summary */}
                <div className="flex justify-around gap-4">
                  {Object.entries(parsedData).map(([sheetName, data]: any) => (
                    <div
                      key={sheetName}
                      className="p-4 bg-muted/30 rounded-lg text-center"
                    >
                      <div className="space-y-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <FileSpreadsheet className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="font-medium">{sheetName}</h4>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {data.length} lignes
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Sheet Navigation */}
                {Object.keys(parsedData).length > 0 && (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="p-4 hover:no-underline cursor-pointer">
                        Voir les données
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="flex gap-2 overflow-x-auto py-2">
                            {Object.keys(parsedData).map((sheet) => (
                              <Button
                                key={sheet}
                                variant={
                                  currentSheet === sheet ? "default" : "outline"
                                }
                                onClick={() => setCurrentSheet(sheet)}
                                className="cursor-pointer"
                              >
                                {sheet}
                              </Button>
                            ))}
                          </div>

                          {currentSheet && (
                            <div className="border rounded-lg overflow-hidden">
                              <DataTable
                                data={parsedData[currentSheet]}
                                // sheetName={currentSheet}
                              />
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Status Info */}
            {file && (
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Prêt à analyser :</strong> Votre fichier a été traité
                  avec succès.
                  {canProceed
                    ? " Vous pouvez maintenant créer votre analyse."
                    : " Veuillez compléter tous les champs requis."}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="flex-1 h-12 gap-2 shadow-sm"
                onClick={saveAnalysis}
                disabled={!canProceed}
                size="lg"
              >
                <Play className="h-5 w-5" />
                Créer l'analyse biostatistique
              </Button>

              <Button
                className="flex-1 h-12 gap-2"
                onClick={downloadAnalysis}
                disabled={!canProceed}
                variant="outline"
                size="lg"
              >
                <Download className="h-5 w-5" />
                Exporter les données
              </Button>
            </div>

            {/* Helper Text */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
              <Clock className="h-4 w-4" />
              L'analyse sera disponible immédiatement après création
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
