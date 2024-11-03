import { db } from "~/server/db";

async function seedAttributes() {
  const attributes = [
    { id: "availSpace", label: "Available space (SF)", defaultVisible: true },
    { id: "propertySize", label: "Property size (SF)", defaultVisible: true },
    { id: "divisibility", label: "Divisibility (SF)", defaultVisible: true },
    { id: "leaseRate", label: "Asking rate (SF/Mo)", defaultVisible: true },
    { id: "expenses", label: "Opex (SF/Mo)", defaultVisible: true },
    { id: "totalCost", label: "All-in cost", defaultVisible: true },
    { id: "leaseType", label: "Direct/Sublease", defaultVisible: true },
    { id: "comments", label: "Comments", defaultVisible: true },

    // general property info
    {
      id: "vacantSpace",
      label: "Vacant Space",
      defaultVisible: false,
      category: "general",
    },
    {
      id: "amenities",
      label: "Amenities",
      defaultVisible: false,
      category: "general",
    },
    {
      id: "yearBuilt",
      label: "Year Built",
      defaultVisible: false,
      category: "general",
    },
    {
      id: "parkingRatio",
      label: "Parking Ratio",
      defaultVisible: false,
      category: "general",
    },
    {
      id: "propertyType",
      label: "Property Type",
      defaultVisible: false,
      category: "general",
    },
    {
      id: "subtypeClass",
      label: "Subtype Class",
      defaultVisible: false,
      category: "general",
    },
    {
      id: "spaceUse",
      label: "Space Use",
      defaultVisible: false,
      category: "general",
    },
    {
      id: "totalFloors",
      label: "Total Floors",
      defaultVisible: false,
      category: "general",
    },

    // lease info
    {
      id: "availDate",
      label: "Available Date",
      defaultVisible: false,
      category: "leaseDetails",
    },
    {
      id: "subExpDate",
      label: "Sublease Expiration Date",
      defaultVisible: false,
      category: "leaseDetails",
    },
    {
      id: "leaseType",
      label: "Lease Type",
      defaultVisible: false,
      category: "leaseDetails",
    },
    {
      id: "constructionStatus",
      label: "Construction Status",
      defaultVisible: false,
      category: "leaseDetails",
    },
    {
      id: "listId",
      label: "Listing ID",
      defaultVisible: false,
      category: "leaseDetails",
    },

    // industrial stuff
    {
      id: "cleanRm",
      label: "Clean Room",
      defaultVisible: false,
      category: "industrial",
    },
    {
      id: "wetRm",
      label: "Wet Room",
      defaultVisible: false,
      category: "industrial",
    },
    {
      id: "dhDoors",
      label: "DH Doors",
      defaultVisible: false,
      category: "industrial",
    },
    {
      id: "glDoors",
      label: "GL Doors",
      defaultVisible: false,
      category: "industrial",
    },
    {
      id: "clearHeight",
      label: "Clear Height",
      defaultVisible: false,
      category: "industrial",
    },
    {
      id: "power",
      label: "Power",
      defaultVisible: false,
      category: "industrial",
    },

    // transportation
    {
      id: "transit",
      label: "Transit",
      defaultVisible: false,
      category: "transportation",
    },
    {
      id: "commuterRail",
      label: "Commuter Rail",
      defaultVisible: false,
      category: "transportation",
    },
    {
      id: "airport",
      label: "Airport",
      defaultVisible: false,
      category: "transportation",
    },
    {
      id: "walkScore",
      label: "Walk Score",
      defaultVisible: false,
      category: "transportation",
    },
    {
      id: "transitScore",
      label: "Transit Score",
      defaultVisible: false,
      category: "transportation",
    },
  ];

  await db.$transaction(async (tx) => {
    await tx.attribute.deleteMany({
      where: {
        id: { notIn: attributes.map((a) => a.id) },
        ownerId: null,
      },
    });
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
            category: attribute.category,
          },
          update: {
            label: attribute.label,
            defaultIndex: i,
            defaultVisible: attribute.defaultVisible,
            category: attribute.category,
          },
        }),
      ),
    );
  });
}
void seedAttributes();
