/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AnalysisSubType,
  AnalysisType,
  CaracteristicType,
} from "@/types/analysis";
import chi2test from "@stdlib/stats/chi2test";
import ttest from "@stdlib/stats/ttest";
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
  if (name === "Catégories d'âge") {
    return {
      name: "Catégories d'âge",
      type: "qualitative",
      options: [
        "< 18 ans",
        "18-29 ans",
        "30-39 ans",
        "40-49 ans",
        "50-59 ans",
        "60-69 ans",
        "70-79 ans",
        "80 ans et plus",
      ],
    };
  }
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

  if (selectedPrimaryCharacteristic?.name === "Catégories d'âge") {
    // Groupement des donnéees selon l'âge de la personne
    const ageGroups = [18, 30, 40, 50, 60, 70, 80, 100];
    ageGroups.forEach((ageGroup, index) => {
      // trier par Age < 18 ans, 18-29 ans, 30-39 ans, 40-49 ans, 50-59 ans, 60-69 ans, 70-79 ans, 80 ans et plus
      const groupData = sheetData.filter((row) => {
        const age = Number(row["Age"]);
        if (ageGroup == 18) {
          return age < 18;
        }
        if (ageGroup == 100) {
          return age >= 80;
        }
        return age >= ageGroups[index - 1] && age < ageGroup;
      });
      groupsData.push(groupData);
    });
  } else if (selectedPrimaryCharacteristic?.options) {
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
      subanalyse.IQR = x.map((group) => calculateNumericStats(group));
      subanalyse.labels = {
        x: [secondaryCharacteristic?.name],
        y: selectedPrimaryCharacteristic?.options as string[],
      };
      if (x.length == 1) {
        // One-sample and paired Student's t-Test.
        subanalyse.result = ttest(x[0]);
      } else if (x.length == 2) {
        // Two-sample Student's t-Test.
        subanalyse.result = ttest2(x[0], x[1]);
      } else if (x.length > 2) {
        // One Way ANOVA
        // Séparation en 2 tableaux comme requis par anova1
        const table1: number[] = [];
        const table2: string[] = [];
        groupsData.forEach((data, index) => {
          data.forEach((row: any) => {
            table1.push(Number(row[secondaryCharacteristic.name]));
            table2.push(
              selectedPrimaryCharacteristic?.options
                ? (selectedPrimaryCharacteristic.options[index] as string)
                : ""
            );
          });
        });
        subanalyse.result = anova1(table1, table2);
      }
    } else if (secondaryCharacteristic?.type == "qualitative") {
      // qualitatif
      let matrix: {
        matrix: number[][];
        rowLabels: string[];
        colLabels: string[];
      };
      if (selectedPrimaryCharacteristic?.name === "Catégories d'âge") {
        // table de contingence selon l'âge
        matrix = createContingencyMatrixFromArrays(
          groupsData,
          secondaryCharacteristic?.name as string
        );
        // contingencyTable =
      } else {
        matrix = createContingencyTable(
          selectedPrimaryCharacteristic?.name as string,
          secondaryCharacteristic?.name as string,
          sheetData
        );
      }
      subanalyse.result = chi2test(matrix.matrix);
      subanalyse.contingencyTable = matrix.matrix;
      subanalyse.labels = {
        x: matrix.colLabels,
        y: matrix.rowLabels,
      };
      if (selectedPrimaryCharacteristic?.name === "Catégories d'âge") {
        subanalyse.labels.y = [
          ...(selectedPrimaryCharacteristic?.options as string[]),
        ];
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
 * Crée un tableau de contingence entre deux caractéristiques
 * @param caracteristicPrimaire - Variable pour les lignes (ex: "Année")
 * @param caracteristicSecondaire - Variable pour les colonnes (ex: "ALD")
 * @param data - Tableau d'objets contenant les données
 * @returns { matrix: number[][], rowLabels: string[], colLabels: string[] }
 */
function createContingencyTable(
  caracteristicPrimaire: string,
  caracteristicSecondaire: string,
  data: any[]
): {
  matrix: number[][];
  rowLabels: string[];
  colLabels: string[];
} {
  // 1. Obtenir les valeurs uniques et les trier
  const rowLabels = [
    ...new Set(
      data.map((row) => String(row[caracteristicPrimaire] ?? "Non spécifié"))
    ),
  ].sort();

  const colLabels = [
    ...new Set(
      data.map((row) => String(row[caracteristicSecondaire] ?? "Non spécifié"))
    ),
  ].sort();

  // 2. Initialiser la matrice avec des 0
  const matrix: number[][] = Array(rowLabels.length)
    .fill(0)
    .map(() => Array(colLabels.length).fill(0));

  // 3. Remplir la matrice
  data.forEach((row) => {
    const rowValue = String(row[caracteristicPrimaire] ?? "Non spécifié");
    const colValue = String(row[caracteristicSecondaire] ?? "Non spécifié");

    const rowIndex = rowLabels.indexOf(rowValue);
    const colIndex = colLabels.indexOf(colValue);

    if (rowIndex >= 0 && colIndex >= 0) {
      matrix[rowIndex][colIndex]++;
    }
  });

  return { matrix, rowLabels, colLabels };
}

/**
 * Génère une matrice de contingence pour le test du Chi²
 * @param data Arrays d'objets à comparer (ex: [feuille1, feuille2, feuille3])
 * @param key Clé qualitative à analyser (ex: "ALD", "Complementaire")
 * @returns { matrix: number[][], rowLabels: string[], colLabels: string[] }
 */
function createContingencyMatrixFromArrays<T extends Record<string, any>>(
  data: T[][],
  key: keyof T
): {
  matrix: number[][];
  rowLabels: string[];
  colLabels: string[];
} {
  // 1. Collecter toutes les valeurs uniques de la clé
  const allValues = new Set<string>();
  data.forEach((group) => {
    group.forEach((item) => {
      const value = String(item[key] ?? "Non spécifié");
      allValues.add(value);
    });
  });

  // 2. Initialiser la matrice [groupes × valeurs]
  const colLabels = Array.from(allValues).sort();
  const rowLabels = data.map((_, i) => `Groupe ${i + 1}`);
  const matrix: number[][] = Array(data.length)
    .fill(0)
    .map(() => Array(colLabels.length).fill(0));

  // 3. Remplir la matrice
  data.forEach((group, groupIdx) => {
    group.forEach((item) => {
      const value = String(item[key] ?? "Non spécifié");
      const valueIdx = colLabels.indexOf(value);
      matrix[groupIdx][valueIdx]++;
    });
  });

  return { matrix, rowLabels, colLabels };
}

/**
 * Calculate the median, quartiles, mean, and standard deviation of a numeric array.
 * @param {Array<number>} data - The input data.
 * @returns {Object} - An object with properties `median`, `q1`, `q3`, `mean`, and `std`, representing the median, first quartile, third quartile, mean, and standard deviation of the data respectively.
 */
function calculateNumericStats(data: number[]): {
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
      if (x.length == 1) {
        // One-sample and paired Student's t-Test.
        subanalyse.result = ttest(x[0]);
      } else if (sheetData.length === 2) {
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
      const matrix = createGlobalContingencyTable(
        sheetData,
        sheetsNames,
        characteristic.name
      );
      subanalyse.result = chi2test(matrix.matrix);
      subanalyse.contingencyTable = matrix.matrix;
      subanalyse.labels = {
        x: matrix.colLabels,
        y: matrix.rowLabels,
      };
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
 * Génère une matrice de contingence globale pour le test du Chi²
 * @param data Tableau 3D des feuilles Excel [feuille][ligne][colonne]
 * @param sheetNames Noms des feuilles (pour rowLabels)
 * @param variable Variable qualitative à analyser
 * @returns { matrix: number[][], rowLabels: string[], colLabels: string[] }
 */
function createGlobalContingencyTable(
  data: any[][][],
  sheetNames: string[],
  variable: string
): {
  matrix: number[][];
  rowLabels: string[];
  colLabels: string[];
} {
  // 1. Collecter toutes les catégories uniques (triées)
  const allCategories = new Set<string>();
  data.forEach((sheet) => {
    sheet.forEach((row) => {
      allCategories.add(String(row[variable as any] ?? "Non renseigné"));
    });
  });
  const colLabels = Array.from(allCategories).sort();

  // 2. Initialiser la matrice [feuilles × catégories]
  const matrix: number[][] = Array(sheetNames.length)
    .fill(0)
    .map(() => Array(colLabels.length).fill(0));

  // 3. Créer un index rapide des catégories
  const categoryIndex: Record<string, number> = {};
  colLabels.forEach((cat, idx) => {
    categoryIndex[cat] = idx;
  });

  // 4. Remplir la matrice
  data.forEach((sheet, sheetIdx) => {
    sheet.forEach((row) => {
      const cat = String(row[variable as any] ?? "Non renseigné");
      matrix[sheetIdx][categoryIndex[cat]]++;
    });
  });

  return {
    matrix,
    rowLabels: [...sheetNames], // Copie des noms de feuilles
    colLabels,
  };
}
