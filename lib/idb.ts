/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from "xlsx";
import { get, keys } from "idb-keyval";
import { Analysis } from "@/types/analysis";

export const loadAnalyses = async () => {
  const analysisKeys = (await keys()).filter(
    (key) => typeof key === "string" && key.startsWith("analysis_")
  );
  const loadedAnalyses = await Promise.all(analysisKeys.map((key) => get(key)));
  return loadedAnalyses.filter(Boolean) as Analysis[];
};

// retourne une analyse selon son id
export const getAnalysis = async (id: string) => get(`analysis_${id}`);

export const parseExcelData = (analysis: Analysis) => {
  const workbook = XLSX.read(analysis.data);
  const result: Record<string, any[]> = {};

  analysis.sheets.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
  });

  return result;
};
