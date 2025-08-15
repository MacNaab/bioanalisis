/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/analyses/nouveau/page.tsx
"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { set, keys } from "idb-keyval";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/DataTable";
import { Analysis } from "@/types/analysis";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";

export default function NouvelleAnalyse() {
  const [file, setFile] = useState<File | null>(null);
  const [analysisName, setAnalysisName] = useState("");
  const [parsedData, setParsedData] = useState<Record<string, any[]>>({});
  const [currentSheet, setCurrentSheet] = useState<string | null>(null);

  const router = useRouter();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    // Parse all sheets
    const sheetsData: Record<string, any[]> = {};
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      sheetsData[sheetName] = XLSX.utils.sheet_to_json(worksheet);
    });

    setParsedData(sheetsData);
    setCurrentSheet(workbook.SheetNames[0]);
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
      const existingKeys = await keys();
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
      await set(`analysis_${analysis.id}`, analysis);

      // Feedback utilisateur
      toast.success("Analyse créée avec succès", {
        description: `${analysis.sheets.length} feuille(s) importée(s)`,
        action: {
          label: "Voir",
          onClick: () => router.push(`/biostatistics/${analysis.id}`),
        },
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde", error);
      toast.error("Échec de la création", {
        description: "Une erreur est survenue lors de l'enregistrement",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Nouvelle analyse biomédicale</h1>

      <div className="grid gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Fichier Excel
          </label>
          <Input
            type="file"
            className="cursor-pointer"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
          />
        </div>

        {file && (
          <div>
            <label className="block mb-2 text-sm font-medium">
              Nom de l'analyse
            </label>
            <Input
              value={analysisName}
              onChange={(e) => setAnalysisName(e.target.value)}
              placeholder="Analyse sanguine 2023"
            />
          </div>
        )}
      </div>

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
                      variant={currentSheet === sheet ? "default" : "outline"}
                      onClick={() => setCurrentSheet(sheet)}
                      className="cursor-pointer"
                    >
                      {sheet} ({parsedData[sheet].length} lignes)
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

      <Button
        className="w-full cursor-pointer"
        onClick={saveAnalysis}
        disabled={!file || !analysisName}
      >
        Créer l'analyse
      </Button>
    </div>
  );
}
