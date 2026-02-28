import ExcelJS from "exceljs";

/**
 * Export data to an Excel file
 * @param data Array of objects to export
 * @param fileName Name of the file to download
 * @param sheetName Name of the worksheet
 */
export async function exportToExcel(
  data: any[],
  fileName: string,
  sheetName: string = "Sheet1",
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  if (data.length > 0) {
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    worksheet.columns = headers.map((header) => ({
      header: header,
      key: header,
      width: Math.max(header.length + 5, 15),
    }));

    // Add rows
    worksheet.addRows(data);

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE9F2FF" },
    };
  }

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Download file
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Read Excel file and return JSON data
 * @param file File object from input
 * @returns Promise with array of objects
 */
export async function readExcel(file: File): Promise<any[]> {
  const workbook = new ExcelJS.Workbook();
  const arrayBuffer = await file.arrayBuffer();
  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) return [];

  const data: any[] = [];
  const headerRow = worksheet.getRow(1);
  const headers: string[] = [];

  headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    headers[colNumber] = cell.value?.toString() || `Column${colNumber}`;
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header

    const rowData: any = {};
    let hasData = false;

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const header = headers[colNumber];
      if (header) {
        let value = cell.value;
        // Handle formula values
        if (value && typeof value === "object" && "result" in value) {
          value = (value as any).result;
        }
        // Handle shared strings or rich text
        if (value && typeof value === "object" && "richText" in value) {
          value = (value as any).richText.map((rt: any) => rt.text).join("");
        }

        rowData[header] = value;
        if (value !== null && value !== undefined && value !== "") {
          hasData = true;
        }
      }
    });

    if (hasData) {
      data.push(rowData);
    }
  });

  return data;
}
