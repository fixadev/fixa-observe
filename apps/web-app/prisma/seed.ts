import { db } from "~/server/db";

async function seedAttributes() {
  const attributes = [
    { id: "size", label: "Available space (SF)", defaultVisible: true },
    { id: "divisibility", label: "Divisibility (SF)", defaultVisible: true },
    { id: "askingRate", label: "Asking rate (SF/Mo)", defaultVisible: true },
    { id: "opEx", label: "Opex (SF/Mo)", defaultVisible: true },
    { id: "totalCost", label: "All-in cost", defaultVisible: true },
    { id: "directSublease", label: "Direct/Sublease", defaultVisible: true },
    { id: "comments", label: "Comments", defaultVisible: true },

    { id: "propertyType", label: "Property Type", defaultVisible: false },
    { id: "listId", label: "List ID", defaultVisible: false },
    { id: "suite", label: "Suite", defaultVisible: false },
    { id: "availDate", label: "Available Date", defaultVisible: false },
    { id: "subtypeClass", label: "Subtype Class", defaultVisible: false },
    { id: "spaceUse", label: "Space Use", defaultVisible: false },
    { id: "leaseType", label: "Lease Type", defaultVisible: false },
    {
      id: "subExpDate",
      label: "Sublease Expiration Date",
      defaultVisible: false,
    },
    { id: "totalFloors", label: "Total Floors", defaultVisible: false },

    // lab stuff
    { id: "cleanRm", label: "Clean Room", defaultVisible: false },
    { id: "wetRm", label: "Wet Room", defaultVisible: false },
    { id: "dhDoors", label: "DH Doors", defaultVisible: false },
    { id: "glDoors", label: "GL Doors", defaultVisible: false },
    { id: "clearHeight", label: "Clear Height", defaultVisible: false },
    { id: "power", label: "Power", defaultVisible: false },

    { id: "vacantSpace", label: "Vacant Space", defaultVisible: false },
    {
      id: "constructionStatus",
      label: "Construction Status",
      defaultVisible: false,
    },
    { id: "yearBuilt", label: "Year Built", defaultVisible: false },
    { id: "parkingRatio", label: "Parking Ratio", defaultVisible: false },
  ];

  await db.$transaction(async (tx) => {
    await Promise.all(
      attributes.map((attribute, i) =>
        tx.attribute.upsert({
          where: {
            id: attribute.id,
          },
          create: {
            id: attribute.id,
            label: attribute.label,
            defaultIndex: i,
            defaultVisible: attribute.defaultVisible,
            ownerId: null,
          },
          update: {
            label: attribute.label,
            defaultIndex: i,
            defaultVisible: attribute.defaultVisible,
          },
        }),
      ),
    );
  });
}
void seedAttributes();
