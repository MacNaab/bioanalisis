/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from "xlsx";
import { del, set, get, keys } from "idb-keyval";
import { Analysis } from "@/types/analysis";
import { dbObserver } from "@/lib/dbObserver";

/**
 * Loads all analyses from IndexedDB.
 *
 * @returns {Promise<Analysis[]>} An array of all analyses in IndexedDB.
 */
export const loadAnalyses = async () => {
  const analysisKeys = (await keys()).filter(
    (key) => typeof key === "string" && key.startsWith("analysis_")
  );
  const loadedAnalyses = await Promise.all(analysisKeys.map((key) => get(key)));
  return loadedAnalyses.filter(Boolean) as Analysis[];
};

/**
 * Retrieves an analysis from IndexedDB by its ID.
 *
 * @param {string} id - The ID of the analysis to retrieve.
 * @returns {Promise<Analysis | undefined>} - A promise that resolves to the analysis object with the specified ID, or undefined if no such analysis exists.
 */
export const getAnalysis = async (id: string) => get(`analysis_${id}`);

/**
 * Saves an `Analysis` object to IndexedDB, a client-side storage system.
 * The object is stored with a key in the format "analysis_<id>", where `<id>` is the unique identifier of the analysis.
 *
 * @param {Analysis} analysis - The `Analysis` object to be saved.
 * @return {Promise<void>} A promise that resolves when the analysis is successfully saved.
 */
export const saveAnalysis = async (analysis: Analysis): Promise<void> => {
  set(`analysis_${analysis.id}`, analysis);
  dbObserver.emit("db-update");
};

/**
 * Deletes an analysis from IndexedDB based on its ID.
 * The `del` function from `idb-keyval` is used to delete the key-value pair where the key is `analysis_${id}`.
 *
 * @param {string} id - The ID of the analysis to be deleted.
 * @return {Promise<void>} A promise that resolves when the analysis is successfully deleted.
 */
export const deleteAnalysis = async (id: string) => {
  del(`analysis_${id}`);
  dbObserver.emit("db-update");
};

/**
 * Retrieves all the keys stored in IndexedDB.
 *
 * @returns {Promise<string[]>} An array of all the keys stored in IndexedDB.
 */
export const getKeys = async () => keys();

/**
 * Parses the data from an Excel file and returns it as a Record, where the keys are the sheet names and the values are the parsed data from each sheet.
 *
 * @param {Analysis} analysis - The analysis object that contains the data from the Excel file.
 * @return {Record<string, any[]>} A Record where the keys are the sheet names and the values are the parsed data from each sheet.
 */
export const parseExcelData = (analysis: Analysis) => {
  const workbook = XLSX.read(analysis.data);
  const result: Record<string, any[]> = {};

  analysis.sheets.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
  });

  return result;
};
