import ExcelJS from "exceljs";
import { type AttributeSchema, type PropertySchema } from "~/lib/property";

export function createExcelWorksheet(
  properties: PropertySchema[],
  attributes: AttributeSchema[],
) {
  try {
    console.log("properties", properties);
    console.log("attributes", attributes);
    console.log("creating excel worksheet");
    const workbook = new ExcelJS.Workbook();
    console.log("workbook created");
    const worksheet = workbook.addWorksheet("Property Survey", {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    // Add logo
    try {
    //   const logoId = workbook.addImage({
    //     base64:
    //       "https://mma.prnewswire.com/media/1057994/Newmark_Group_Inc_Logo.jpg?p=facebook",
    //     extension: "jpeg",
    //   });
    //   worksheet.addImage(logoId, {
    //     tl: { col: 0, row: 0 },
    //     ext: { width: 100, height: 30 },
    //   });
    } catch (error) {
      console.error("Error adding logo:", error);
    }

    // Add title
    worksheet.mergeCells("A1:C1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "Property Survey";
    titleCell.font = { size: 20, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    // Add headers
    const headers = ["", "Photo", ...attributes.map((attr) => attr.label)];
    worksheet.addRow(headers);

    // Style header row
    const headerRow = worksheet.getRow(2);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF046BB6" },
      };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
    });

    // Add data rows
    properties.forEach((property, index) => {
      const rowData = [
        index + 1,
        {
          text: "Photo",
          hyperlink:
            property.photoUrl ??
            "https://m.foolcdn.com/media/dubs/images/GettyImages-695968212.width-880.jpg",
        },
        ...attributes.map((attr) => {
          if (attr.id === "address") {
            const address = property.attributes.address;
            const formattedAddress = address
              ? address.split(",").slice(0, 2).join(",\n")
              : "";
            return {
              text: formattedAddress,
              hyperlink: property.brochures[0]?.url ?? "",
            };
          }
          return property.attributes[attr.id] ?? "";
        }),
      ];
      worksheet.addRow(rowData);
    });

    // Style data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 2) {
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          if (colNumber === 1) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF046BB6" },
            };
            cell.font = { color: { argb: "FFFFFFFF" } };
          }
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };
        });
      }
    });

    // Set column widths
    worksheet.columns = [
      { width: 5 },
      { width: 15 },
      ...attributes.map((attr) => {
        if (attr.id === "address") return { width: 20 };
        if (attr.id === "size") return { width: 10 };
        if (attr.id === "divisibility") return { width: 12 };
        if (attr.id === "askingRate" || attr.id === "opEx")
          return { width: 12 };
        if (attr.id === "comments") return { width: 25 };
        return { width: 15 };
      }),
    ];

    return workbook;
  } catch (error) {
    console.error("Error creating Excel worksheet:", error);
    throw new Error("Failed to create Excel worksheet");
  }
}

const testAttributes = [
  {
    id: "address",
    createdAt: "2024-10-06T05:25:08.938Z",
    updatedAt: "2024-10-06T05:25:08.938Z",
    label: "Address",
    type: "string",
    ownerId: null,
  },
  {
    id: "size",
    createdAt: "2024-10-06T05:25:08.991Z",
    updatedAt: "2024-10-06T05:25:08.991Z",
    label: "Size (SF)",
    type: "string",
    ownerId: null,
  },
  {
    id: "divisibility",
    createdAt: "2024-10-06T05:25:09.038Z",
    updatedAt: "2024-10-06T05:25:09.038Z",
    label: "Divisibility (SF)",
    type: "string",
    ownerId: null,
  },
  {
    id: "askingRate",
    createdAt: "2024-10-06T05:25:09.085Z",
    updatedAt: "2024-10-06T05:25:09.085Z",
    label: "NNN Asking Rate (SF/Mo)",
    type: "string",
    ownerId: null,
  },
  {
    id: "opEx",
    createdAt: "2024-10-06T05:25:09.131Z",
    updatedAt: "2024-10-06T05:25:09.131Z",
    label: "Opex (SF/Mo)",
    type: "string",
    ownerId: null,
  },
  {
    id: "directSublease",
    createdAt: "2024-10-06T05:25:09.182Z",
    updatedAt: "2024-10-06T05:25:09.182Z",
    label: "Direct/Sublease",
    type: "string",
    ownerId: null,
  },
  {
    id: "comments",
    createdAt: "2024-10-06T05:25:09.232Z",
    updatedAt: "2024-10-06T05:25:09.232Z",
    label: "Comments",
    type: "string",
    ownerId: null,
  },
];

const testProperties = [
  {
    id: "d8bd0e24-d761-4921-a773-b733b26f3b96",
    createdAt: "2024-10-09T22:52:59.173Z",
    updatedAt: "2024-10-09T22:52:59.173Z",
    ownerId: "user_2nAxCsO5zVjyGu9wqKyYGa8xQ6b",
    photoUrl:
      "https://pixa-real-estate.s3.amazonaws.com/fd511a9f-f935-4379-9193-35034a783599.png",
    attributes: {
      opEx: "",
      size: "8000",
      address: "401 Lambert Avenue, Palo Alto, CA 94306",
      comments:
        " - Available within 60 days\n - Open Floor Plan w/ 1 conference room (can build more)\n - Kitchenette\n - Two restrooms and a Shower\n - 12 Parking Spaces in secure private garage Private outdoor balconies\n - Call for pricing",
      askingRate: "$4.00",
      divisibility: "3500 - 3500",
      directSublease: "Direct Lease",
    },
    displayIndex: 1,
    surveyId: "42128b98-d0aa-43b1-a366-e4ddc1b514d4",
    brochures: [],
    emailThreads: [],
  },
  {
    id: "166da56e-f25d-49ba-8501-f20a937f4551",
    createdAt: "2024-10-09T22:52:59.173Z",
    updatedAt: "2024-10-09T22:52:59.173Z",
    ownerId: "user_2nAxCsO5zVjyGu9wqKyYGa8xQ6b",
    photoUrl:
      "https://pixa-real-estate.s3.amazonaws.com/4e6c71c0-1fad-44cb-8a6d-c98bc5d61eac.png",
    attributes: {
      opEx: "",
      size: "8975",
      address: "4101 El Camino Way, Palo Alto, CA 94306",
      comments:
        " - Rare stand-along retail building on El Camino Real\n - 11 On-site parking spaces\n - Restaurant infrastructure in place (fume hood, multiple walk-in refrigeration units)\n - Tenant Improvements are available",
      askingRate: "$4.50",
      divisibility: "2768 - 2768",
      directSublease: "Direct Lease",
    },
    displayIndex: 2,
    surveyId: "42128b98-d0aa-43b1-a366-e4ddc1b514d4",
    brochures: [],
    emailThreads: [],
  },
  {
    id: "0573033a-e7aa-4baf-8280-2ae8aa29eff2",
    createdAt: "2024-10-09T22:52:59.173Z",
    updatedAt: "2024-10-09T22:52:59.173Z",
    ownerId: "user_2nAxCsO5zVjyGu9wqKyYGa8xQ6b",
    photoUrl:
      "https://pixa-real-estate.s3.amazonaws.com/651751a1-920b-4e10-8500-0716e3b0f50e.png",
    attributes: {
      opEx: "",
      size: "4029",
      address: "366 Cambridge Ave, Palo Alto, CA 94306",
      comments:
        " - After Hours HVAC Available, Air Conditioning, Balcony, Bicycle Storage, CCTV (Closed Circuit\n - Television Monitoring), Central Heating, Conference Rooms, Hardwood Floors, Kitchen, Natural Light,\n - Plug & Play, Private Restrooms, Security System, Wi-Fi",
      askingRate: "",
      divisibility: "702 - 2717",
      directSublease: "Direct Lease",
    },
    displayIndex: 3,
    surveyId: "42128b98-d0aa-43b1-a366-e4ddc1b514d4",
    brochures: [],
    emailThreads: [],
  },
];

async function test() {
  const workbook = createExcelWorksheet(
    testProperties.map(prop => ({
      ...prop,
      createdAt: new Date(prop.createdAt),
      updatedAt: new Date(prop.updatedAt),
      photoUrl: prop.photoUrl || null
    })),
    testAttributes.map(attr => ({
      ...attr,
      createdAt: new Date(attr.createdAt),
      updatedAt: new Date(attr.updatedAt)
    })),
  );
  await workbook.xlsx.writeFile("test.xlsx");
}