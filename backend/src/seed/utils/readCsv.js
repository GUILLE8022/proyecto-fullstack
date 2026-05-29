import fs from "fs";
import csv from "csv-parser";

export const readCsv = (filePath) =>
  new Promise((resolve, reject) => {
    const rows = [];

    if (!fs.existsSync(filePath)) {
      reject(new Error(`Archivo no encontrado: ${filePath}`));
      return;
    }

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ",", mapHeaders: ({ header }) => header.trim() }))
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
