import {
  AnalysisSubType,
  AnalysisType,
  CaracteristicType,
} from "@/types/analysis";
import chi2test from "@stdlib/stats/chi2test";
import ttest2 from "@stdlib/stats/ttest2";
import * as ss from "simple-statistics";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const baseCaracteristics = [
  { name: "Date", type: "date" },
  { name: "Age", type: "quantitative" },
  { name: "Sexe", type: "qualitative", options: ["Homme", "Femme"] },
  { name: "Departement", type: "qualitative" },
  { name: "Ville", type: "qualitative" },
  { name: "ALD", type: "qualitative", options: [true, false] },
  { name: "Complementaire", type: "qualitative", options: ["C2S", "AME", ""] },
  { name: "MedecinTraitant", type: "qualitative", options: [true, false] },
  { name: "DateMT", type: "date" },
  { name: "Consultations1", type: "quantitative" },
  { name: "Consultations2", type: "quantitative" },
];

/**
 * Find a caracteristic by its name.
 *
 * @param {string} name - The name of the caracteristic to find.
 * @return {CaracteristicType | undefined} The caracteristic with the given name, or undefined if not found.
 */
function getCaracteristicsByName(name: string) {
  return baseCaracteristics.find((caracteristic) => {
    return caracteristic.name === name;
  });
}

/**
 * Perform a biostatistical analysis on the given sheet data.
 *
 * @param {string} sheetName - The name of the sheet.
 * @param {any[]} sheetData - The data of the sheet.
 * @param {string} primaryCharacteristic - The name of the primary characteristic.
 * @param {string[]} secondaryCharacteristics - The names of the secondary characteristics.
 * @return {AnalysisType} The analysis result.
 */
export function analysis(
  sheetName: string,
  sheetData: any[],
  primaryCharacteristic: string,
  secondaryCharacteristics: string[]
): AnalysisType {
  const selectedPrimaryCharacteristic = getCaracteristicsByName(
    primaryCharacteristic
  );
  const selectedSecondaryCharacteristics = secondaryCharacteristics.map(
    (name) => getCaracteristicsByName(name)
  );

  const groupsData: any[] = [];

  if (selectedPrimaryCharacteristic?.options) {
    selectedPrimaryCharacteristic.options.forEach((option) => {
      // Groupement des données par option de la caractéristique primaire
      const groupData = sheetData.filter(
        (row) => row[selectedPrimaryCharacteristic.name] === option
      );
      groupsData.push(groupData);
    });
  }

  const subanalyses: AnalysisSubType[] = [];

  selectedSecondaryCharacteristics.forEach((secondaryCharacteristic) => {
    // Groupement des données par option de la caractéristique secondaire
    const subanalyse: AnalysisSubType = {
      caracteristic: secondaryCharacteristic as CaracteristicType,
      data: [],
      result: null,
    };

    if (secondaryCharacteristic?.type == "quantitative") {
      // quantitatif
      const x = groupsData.map((groupData) => {
        return groupData.map((row: any) =>
          Number(row[secondaryCharacteristic.name])
        );
      });
      subanalyse.data = x;
      if (x.length == 1) {
        // One-sample and paired Student's t-Test.
      } else if (x.length == 2) {
        // Two-sample Student's t-Test.
        subanalyse.result = ttest2(x[0], x[1]);
        subanalyse.IQR = x.map((group) => calculateNumericStats(group));
        subanalyse.labels = {
          x: [secondaryCharacteristic?.name],
          y: selectedPrimaryCharacteristic?.options as string[],
        };
      } else if (x.length > 2) {
        // One Way ANOVA
      }
    } else if (secondaryCharacteristic?.type == "qualitative") {
      // qualitatif
      const contingencyTable = createContingencyTable(
        selectedPrimaryCharacteristic?.name as string,
        secondaryCharacteristic?.name as string,
        sheetData
      );
      subanalyse.result = chi2test(contingencyTable);
      subanalyse.contingencyTable = contingencyTable;
      if (secondaryCharacteristic?.options) {
        // copie array:
        const x = [...secondaryCharacteristic?.options].map((option) =>
          option.toString()
        );
        const y = [...(selectedPrimaryCharacteristic?.options as string[])];
        subanalyse.labels = {
          x: x.reverse(),
          y: y.reverse(),
        };
      }
    } else {
      // date
    }
    subanalyses.push(subanalyse);
  });

  return {
    name: sheetName,
    main: primaryCharacteristic,
    groupsData,
    subanalyses,
  };
}

/**
 * Create a contingency table for two qualitative variables.
 * @param {string} caracteristicPrimaire - The name of the primary characteristic.
 * @param {string} caracteristicSecondaire - The name of the secondary characteristic.
 * @param {Array} data - The data containing the characteristics.
 * @returns {Array} - The contingency table.
 */
export function createContingencyTable(
  caracteristicPrimaire: string,
  caracteristicSecondaire: string,
  data: any[]
): number[][] {
  const contingencyTable: number[][] = [];

  // Get the unique values of the primary characteristic.
  const uniqueValuesPrimaire = [
    ...new Set(data.map((row) => row[caracteristicPrimaire])),
  ];

  // Get the unique values of the secondary characteristic.
  const uniqueValuesSecondaire = [
    ...new Set(data.map((row) => row[caracteristicSecondaire])),
  ];

  // Initialize the contingency table.
  for (let i = 0; i < uniqueValuesPrimaire.length; i++) {
    contingencyTable[i] = Array(uniqueValuesSecondaire.length).fill(0);
  }

  // Populate the contingency table.
  data.forEach((row) => {
    const indexPrimaire = uniqueValuesPrimaire.indexOf(
      row[caracteristicPrimaire]
    );
    const indexSecondaire = uniqueValuesSecondaire.indexOf(
      row[caracteristicSecondaire]
    );
    contingencyTable[indexPrimaire][indexSecondaire]++;
  });

  return contingencyTable;
}

// calculateNumericStats

/**
 * Calculate the median, quartiles, mean, and standard deviation of a numeric array.
 * @param {Array<number>} data - The input data.
 * @returns {Object} - An object with properties `median`, `q1`, `q3`, `mean`, and `std`, representing the median, first quartile, third quartile, mean, and standard deviation of the data respectively.
 */
export function calculateNumericStats(data: number[]): {
  median: number;
  q1: number;
  q3: number;
  mean: number;
  std: number;
} {
  /*
  const sortedData = [...data].sort((a, b) => a - b);
  const medianIndex = Math.floor(sortedData.length / 2);
  const median = sortedData.length % 2 === 0 ? (sortedData[medianIndex - 1] + sortedData[medianIndex]) / 2 : sortedData[medianIndex];
  const q1Index = Math.floor(sortedData.length / 4);
  const q1 = sortedData[q1Index];
  const q3Index = Math.floor((sortedData.length * 3) / 4);
  const q3 = sortedData[q3Index];
  */

  const median = ss.median(data);
  const q1 = ss.quantile(data, 0.25);
  const q3 = ss.quantile(data, 0.75);
  const mean = ss.mean(data);
  const std = data.length > 1 ? ss.standardDeviation(data) : 0;

  return { median, q1, q3, mean, std };
}
