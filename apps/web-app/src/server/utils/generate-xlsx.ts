import ExcelJS from "exceljs";
import { type AttributeSchema, type PropertySchema } from "~/lib/property";

export function createExcelWorksheet(
  properties: PropertySchema[],
  attributes: AttributeSchema[],
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Simple Property Survey");

  // Add headers
  const headers = ["Address", "Size (SF)", "Asking Rate"];
  worksheet.addRow(headers);

  // Add data rows
  properties.forEach((property) => {
    const rowData = [
      property.attributes.address || "",
      property.attributes.size || "",
      property.attributes.askingRate || "",
    ];
    worksheet.addRow(rowData);
  });

  // Simple styling
  worksheet.getRow(1).font = { bold: true };
  worksheet.columns.forEach((column) => {
    column.width = 20;
  });

  return workbook;
}

const testProperties = [
  {
    attributes: {
      address: "401 Lambert Avenue, Palo Alto, CA 94306",
      size: "8000",
      askingRate: "$4.00",
    },
  },
  {
    attributes: {
      address: "4101 El Camino Way, Palo Alto, CA 94306",
      size: "8975",
      askingRate: "$4.50",
    },
  },
  {
    attributes: {
      address: "366 Cambridge Ave, Palo Alto, CA 94306",
      size: "4029",
      askingRate: "",
    },
  },
];

async function test() {
  const workbook = createExcelWorksheet(
    testProperties as PropertySchema[],
    [] as AttributeSchema[]
  );
  await workbook.xlsx.writeFile("simple_test.xlsx");
  console.log("Excel file 'simple_test.xlsx' has been created.");
}

test().catch(console.error);