/* eslint-disable @typescript-eslint/no-explicit-any */
// types/analysis.ts
export interface Analysis {
  id: string;
  name: string;
  fileName: string;
  sheets: string[];
  data: ArrayBuffer; // Données brutes du fichier Excel
  createdAt: Date;
  metadata?: {
    rowCounts?: Record<string, number>;
    columns?: Record<string, string[]>;
  };
}

export type CaracteristicType = {
  name: string;
  type: "date" | "quantitative" | "qualitative";
  options?: any[];
};

export type AnalysisType = {
  name: string;
  main: string;
  groupsData: any[];
  subanalyses: AnalysisSubType[];
};

export type AnalysisSubType = {
  caracteristic: CaracteristicType;
  data: any[];
  result: any;
  contingencyTable?: number[][];
  IQR?: { median: number; q1: number; q3: number; mean: number; std: number }[];
  labels?: {
    x: string[];
    y: string[];
  };
};
