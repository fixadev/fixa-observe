import ExcelJS from "exceljs";
import { type AttributeSchema, type PropertySchema } from "~/lib/property";

export function createExcelWorksheet(
  properties: PropertySchema[],
  attributes: AttributeSchema[],
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Simple Property Survey");
  worksheet.headerFooter.oddFooter = "&LPage &P of &N";

  worksheet.pageSetup.margins = {
    left: 0.7, right: 0.7,
    top: 0.75, bottom: 0.75,
    header: 0.3, footer: 0.3
  };

  worksheet.pageSetup.printArea = 'B2:H20';

  // Add headers

  const headers = ['']
  const headerRow = worksheet.addRow(headers);
  headerRow.height = 30;

  // add/style headers
  for (let i = 0; i < attributes.length; i++) { 
    const cell = worksheet.getCell(1, i + 2);
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF046BB6' },
    }; 
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.value = {
      richText: [
        { 'font': {'size': 12,'color': {'theme': 0},'name': 'Calibri','family': 2,'scheme': 'minor', 'bold': true}, 'text': attributes[i]?.label ?? '' },
      ],
    };
  }


  // Add rows
  properties.forEach((property, index) => {
    const rowData = attributes.map((attr) => property.attributes[attr.id]);
    worksheet.addRow([index, ...rowData]);
    for (let i = 0; i < rowData.length; i++) {
      const cell = worksheet.getCell(index + 2, i + 2);
      cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

    }
  });

  // add row numbers
  for (let i = 1; i < properties.length + 1; i++) { 
    const cell = worksheet.getCell(i + 1, 1);
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF046BB6' },
    }; 
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.value = {
      richText: [
        { 'font': {'size': 12,'color': {'theme': 0},'name': 'Calibri','family': 2,'scheme': 'minor', 'bold': true}, 'text': i.toString() },
      ],
    };

    worksheet.getCell(i + 1, 8).alignment = { wrapText: true };
  }

  // Simple styling
  worksheet.getRow(1).font = { bold: true };

  worksheet.columns.forEach((column, index) => {
    if (index === 0) {
      worksheet.columns[index]!.width = 3;
    }
    if (index === 1) {
      worksheet.columns[index]!.width = 30;
    }
    else if (index > 1 && index < 7) {
      worksheet.columns[index]!.width = 14;
    }
    else if (index === 7) { 
      worksheet.columns[index]!.width = 50;
    } 
  });


  return workbook;
}


//   worksheet.getCell('A1').value = {
//     'richText': [
//       {'font': {'size': 12,'color': {'theme': 0},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': 'This is '},
//       {'font': {'italic': true,'size': 12,'color': {'theme': 0},'name': 'Calibri','scheme': 'minor'},'text': 'a'},
//       {'font': {'size': 12,'color': {'theme': 1},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': ' '},
//       {'font': {'size': 12,'color': {'argb': 'FFFF6600'},'name': 'Calibri','scheme': 'minor'},'text': 'colorful'},
//       {'font': {'size': 12,'color': {'theme': 1},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': ' text '},
//       {'font': {'size': 12,'color': {'argb': 'FFCCFFCC'},'name': 'Calibri','scheme': 'minor'},'text': 'with'},
//       {'font': {'size': 12,'color': {'theme': 1},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': ' in-cell '},
//       {'font': {'bold': true,'size': 12,'color': {'theme': 1},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': 'format'}
//     ]
//   };

                                                                                                                    
// const testAttributes = [
//     {
//       id: "address",
//       createdAt: "2024-10-06T05:25:08.938Z",
//       updatedAt: "2024-10-06T05:25:08.938Z",
//       label: "Address",
//       type: "string",
//       ownerId: null,
//     },
//     {
//       id: "size",
//       createdAt: "2024-10-06T05:25:08.991Z",
//       updatedAt: "2024-10-06T05:25:08.991Z",
//       label: "Size (SF)",
//       type: "string",
//       ownerId: null,
//     },
//     {
//       id: "divisibility",
//       createdAt: "2024-10-06T05:25:09.038Z",
//       updatedAt: "2024-10-06T05:25:09.038Z",
//       label: "Divisibility (SF)",
//       type: "string",
//       ownerId: null,
//     },
//     {
//       id: "askingRate",
//       createdAt: "2024-10-06T05:25:09.085Z",
//       updatedAt: "2024-10-06T05:25:09.085Z",
//       label: "NNN Asking Rate (SF/Mo)",
//       type: "string",
//       ownerId: null,
//     },
//     {
//       id: "opEx",
//       createdAt: "2024-10-06T05:25:09.131Z",
//       updatedAt: "2024-10-06T05:25:09.131Z",
//       label: "Opex (SF/Mo)",
//       type: "string",
//       ownerId: null,
//     },
//     {
//       id: "directSublease",
//       createdAt: "2024-10-06T05:25:09.182Z",
//       updatedAt: "2024-10-06T05:25:09.182Z",
//       label: "Direct/Sublease",
//       type: "string",
//       ownerId: null,
//     },
//     {
//       id: "comments",
//       createdAt: "2024-10-06T05:25:09.232Z",
//       updatedAt: "2024-10-06T05:25:09.232Z",
//       label: "Comments",
//       type: "string",
//       ownerId: null,
//     },
//   ];
  
//   const testProperties = [
//     {
//       id: "d8bd0e24-d761-4921-a773-b733b26f3b96",
//       createdAt: "2024-10-09T22:52:59.173Z",
//       updatedAt: "2024-10-09T22:52:59.173Z",
//       ownerId: "user_2nAxCsO5zVjyGu9wqKyYGa8xQ6b",
//       photoUrl:
//         "https://pixa-real-estate.s3.amazonaws.com/fd511a9f-f935-4379-9193-35034a783599.png",
//       attributes: {
//         opEx: "",
//         size: "8000",
//         address: "401 Lambert Avenue, Palo Alto, CA 94306",
//         comments:
//           " - Available within 60 days\n - Open Floor Plan w/ 1 conference room (can build more)\n - Kitchenette\n - Two restrooms and a Shower\n - 12 Parking Spaces in secure private garage Private outdoor balconies\n - Call for pricing",
//         askingRate: "$4.00",
//         divisibility: "3500 - 3500",
//         directSublease: "Direct Lease",
//       },
//       displayIndex: 1,
//       surveyId: "42128b98-d0aa-43b1-a366-e4ddc1b514d4",
//       brochures: [],
//       emailThreads: [],
//     },
//     {
//       id: "166da56e-f25d-49ba-8501-f20a937f4551",
//       createdAt: "2024-10-09T22:52:59.173Z",
//       updatedAt: "2024-10-09T22:52:59.173Z",
//       ownerId: "user_2nAxCsO5zVjyGu9wqKyYGa8xQ6b",
//       photoUrl:
//         "https://pixa-real-estate.s3.amazonaws.com/4e6c71c0-1fad-44cb-8a6d-c98bc5d61eac.png",
//       attributes: {
//         opEx: "",
//         size: "8975",
//         address: "4101 El Camino Way, Palo Alto, CA 94306",
//         comments:
//           " - Rare stand-along retail building on El Camino Real\n - 11 On-site parking spaces\n - Restaurant infrastructure in place (fume hood, multiple walk-in refrigeration units)\n - Tenant Improvements are available",
//         askingRate: "$4.50",
//         divisibility: "2768 - 2768",
//         directSublease: "Direct Lease",
//       },
//       displayIndex: 2,
//       surveyId: "42128b98-d0aa-43b1-a366-e4ddc1b514d4",
//       brochures: [],
//       emailThreads: [],
//     },
//     {
//       id: "0573033a-e7aa-4baf-8280-2ae8aa29eff2",
//       createdAt: "2024-10-09T22:52:59.173Z",
//       updatedAt: "2024-10-09T22:52:59.173Z",
//       ownerId: "user_2nAxCsO5zVjyGu9wqKyYGa8xQ6b",
//       photoUrl:
//         "https://pixa-real-estate.s3.amazonaws.com/651751a1-920b-4e10-8500-0716e3b0f50e.png",
//       attributes: {
//         opEx: "",
//         size: "4029",
//         address: "366 Cambridge Ave, Palo Alto, CA 94306",
//         comments:
//           " - After Hours HVAC Available, Air Conditioning, Balcony, Bicycle Storage, CCTV (Closed Circuit\n - Television Monitoring), Central Heating, Conference Rooms, Hardwood Floors, Kitchen, Natural Light,\n - Plug & Play, Private Restrooms, Security System, Wi-Fi",
//         askingRate: "",
//         divisibility: "702 - 2717",
//         directSublease: "Direct Lease",
//       },
//       displayIndex: 3,
//       surveyId: "42128b98-d0aa-43b1-a366-e4ddc1b514d4",
//       brochures: [],
//       emailThreads: [],
//     },
//   ];

// async function test() {
//   const workbook = createExcelWorksheet(testProperties, testAttributes);
//   await workbook.xlsx.writeFile("simple_test.xlsx");
//   console.log("Excel file 'simple_test.xlsx' has been created.");
// }

// test().catch(console.error);