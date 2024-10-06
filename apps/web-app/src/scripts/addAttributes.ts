import { db } from "~/server/db";

async function uploadAttributes() {
  const attributes = [
    { id: "address", label: "Address", type: "string" },
    { id: "size", label: "Size (SF)", type: "string" },
    { id: "divisibility", label: "Divisibility (SF)", type: "string" },
    { id: "askingRate", label: "NNN Asking Rate (SF/Mo)", type: "string" },
    { id: "opEx", label: "Opex (SF/Mo)", type: "string" },
    { id: "directSublease", label: "Direct/Sublease", type: "string" },
    { id: "comments", label: "Comments", type: "string" },
  ];

  for (const attribute of attributes) {
    await db.attribute.create({
      data: {
        id: attribute.id,
        label: attribute.label,
        type: attribute.type,
        ownerId: null,
      },
    });
  }
}
void uploadAttributes();
