/* eslint-disable @typescript-eslint/no-explicit-any */
// app/analyses/liste/page.tsx
"use client";

import { useEffect, useState } from "react";
import { get, keys } from "idb-keyval";
import * as XLSX from "xlsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Analysis } from "@/types/analysis"; // À créer (voir plus bas)
import { DataTable } from "@/components/DataTable";

export default function ListeAnalyses() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  // Chargement des analyses
  useEffect(() => {
    loadAnalyses();
  }, []);

  // ... les fonctions vont ici
  const loadAnalyses = async () => {
    try {
      const analysisKeys = (await keys()).filter(
        (key) => typeof key === "string" && key.startsWith("analysis_")
      );

      const loadedAnalyses = await Promise.all(
        analysisKeys.map((key) => get(key))
      );

      setAnalyses(loadedAnalyses.filter(Boolean) as Analysis[]);
    } catch (error) {
      console.error("Erreur lors du chargement des analyses", error);
    }
  };
  const parseExcelData = (analysis: Analysis) => {
    const workbook = XLSX.read(analysis.data);
    const result: Record<string, any[]> = {};

    analysis.sheets.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
    });

    return result;
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Analyses biomédicales existantes
      </h1>

      {analyses.length === 0 ? (
        <p className="text-gray-500">Aucune analyse disponible</p>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {analyses.map((analysis) => (
            <AccordionItem
              key={analysis.id}
              value={analysis.id}
              className="border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="p-4 hover:no-underline bg-gray-50 cursor-pointer">
                <div className="flex-1 text-left">
                  <h2 className="font-semibold">{analysis.name}</h2>
                  <p className="text-sm text-gray-500">
                    {analysis.fileName} • {analysis.sheets.length} feuille
                    {analysis.sheets.length > 1 ? "s" : ""} •&nbsp;Créé le&nbsp;
                    {new Date(analysis.createdAt).toLocaleDateString(
                      undefined,
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </AccordionTrigger>

              <AccordionContent className="p-4 bg-white">
                <div className="space-y-6">
                  {analysis.sheets.map((sheetName) => (
                    <div
                      key={`${analysis.id}-${sheetName}`}
                      className="border rounded"
                    >
                      <AccordionItem value={`${analysis.id}-${sheetName}`}>
                        <AccordionTrigger className="px-4 py-2 bg-gray-100">
                          {sheetName}
                        </AccordionTrigger>
                        <AccordionContent className="p-4 overflow-auto">
                          <DataTable
                            data={parseExcelData(analysis)[sheetName]}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
