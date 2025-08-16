/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AnalysisSubType,
  AnalysisType,
  CaracteristicType,
} from "@/types/analysis";
import chi2test from "@stdlib/stats/chi2test";
import ttest2 from "@stdlib/stats/ttest2";
import anova1 from "@stdlib/stats/anova1";
import * as ss from "simple-statistics";

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
      } else {
        // x représente la liste des valeurs possibles de secondaryCharacteristic
        const x = getUniqueValuesByKey(
          sheetData,
          secondaryCharacteristic?.name
        );
        const y = [...(selectedPrimaryCharacteristic?.options as string[])];
        subanalyse.labels = {
          x: x,
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
  const median = ss.median(data);
  const q1 = ss.quantile(data, 0.25);
  const q3 = ss.quantile(data, 0.75);
  const mean = ss.mean(data);
  const std = data.length > 1 ? ss.standardDeviation(data) : 0;

  return { median, q1, q3, mean, std };
}

/**
 * Get the unique values of a specific key from an array of objects.
 * @param {Array<Object>} arr - The input array of objects.
 * @param {string} keyName - The name of the key to get the unique values from.
 * @returns {Array} - An array of unique values.
 */
export function getUniqueValuesByKey(arr: any[], keyName: string): any[] {
  const uniqueValues: any[] = [];
  arr.forEach((obj) => {
    if (!uniqueValues.includes(obj[keyName])) {
      uniqueValues.push(obj[keyName]);
    }
  });
  return uniqueValues;
}

export function globalAnalysis(
  sheetsNames: string[],
  sheetsData: any,
  primaryCharacteristic: string,
  secondaryCharacteristics: string[]
): AnalysisType {
  const groupsData: any[] = [];
  const subanalyses: AnalysisSubType[] = [];

  // liste des caracteristiques selectionnées
  const selectedCharacteristics: CaracteristicType[] = [];
  selectedCharacteristics.push(
    getCaracteristicsByName(primaryCharacteristic) as CaracteristicType
  );
  secondaryCharacteristics.forEach((characteristic) => {
    selectedCharacteristics.push(
      getCaracteristicsByName(characteristic) as CaracteristicType
    );
  });

  // Data par feuille
  const sheetData: any[] = [];
  sheetsNames.forEach((sheetName) => {
    sheetData.push(sheetsData[sheetName]);
  });

  selectedCharacteristics.forEach((characteristic: CaracteristicType) => {
    // sous-analyse par caracteristique
    const subanalyse: AnalysisSubType = {
      caracteristic: characteristic,
      data: [],
      result: null,
    };
    if (characteristic.type === "quantitative") {
      // analyse quantitative
      const x = sheetData.map((groupData) => {
        return groupData.map((row: any) => Number(row[characteristic.name]));
      });
      subanalyse.data = x;
      subanalyse.IQR = x.map((group) => calculateNumericStats(group));
      subanalyse.labels = {
        x: [characteristic?.name],
        y: [...sheetsNames],
      };
      if (sheetData.length === 2) {
        // Ttest
        subanalyse.result = ttest2(x[0], x[1]);
      } else if (sheetData.length > 2) {
        // Anova
        // Séparation en 2 tableaux comme requis par anova1
        const table1: number[] = [];
        const table2: string[] = [];

        sheetData.forEach((data, index) => {
          data.forEach((row: any) => {
            table1.push(Number(row[characteristic.name]));
            table2.push(sheetsNames[index]);
          });
        });
        subanalyse.result = anova1(table1, table2);
      }
    } else if (characteristic.type === "qualitative") {
      // analyse qualitative
      // créer une table de contingence en ce basant sur la nom de characteristic et à partir des différents Array de sheetData
      const contingencyTable = createGlobalContingencyTable(
        sheetData,
        sheetsNames,
        characteristic.name
      );
      subanalyse.result = chi2test(contingencyTable);
      subanalyse.contingencyTable = contingencyTable;

      if (characteristic?.options) {
        const x = [...characteristic?.options].map((option) =>
          option.toString()
        );
        const y = [...sheetsNames];
        subanalyse.labels = {
          x: x.reverse(),
          y,
        };
      } else {
        // x représente la liste des valeurs possibles de secondaryCharacteristic
        const x = getUniqueValuesByKey(Object.values(sheetData).flat(), characteristic?.name);
        const y = [...sheetsNames];
        subanalyse.labels = {
          x,
          y,
        };
      }
    } else {
      // date
    }
    subanalyses.push(subanalyse);
  });

  return {
    name: "Global",
    main: primaryCharacteristic,
    groupsData,
    subanalyses,
  };
}

/**
 * Génère une matrice de contingence pour le test du Chi²
 * @param data Tableau de feuilles Excel (3D array)
 * @param sheetNames Noms des feuilles
 * @param variable Variable qualitative à analyser
 * @returns Matrice 2D prête pour le test du Chi²
 */
function createGlobalContingencyTable(
  data: any[][],
  sheetNames: string[],
  variable: string
): number[][] {
  // 1. Collecter toutes les catégories uniques
  const allCategories = new Set<string>();
  data.forEach((sheet) => {
    sheet.forEach((row) => {
      allCategories.add(String(row[variable] ?? "Non renseigné"));
    });
  });

  // 2. Initialiser la matrice [feuilles × catégories]
  const matrix: number[][] = Array(sheetNames.length)
    .fill(0)
    .map(() => Array(allCategories.size).fill(0));

  // 3. Remplir la matrice
  const categoryIndex = Array.from(allCategories).reduce((acc, cat, idx) => {
    acc[cat] = idx;
    return acc;
  }, {} as Record<string, number>);

  data.forEach((sheet, sheetIdx) => {
    sheet.forEach((row) => {
      const cat = String(row[variable] ?? "Non renseigné");
      matrix[sheetIdx][categoryIndex[cat]]++;
    });
  });

  return matrix;
}
