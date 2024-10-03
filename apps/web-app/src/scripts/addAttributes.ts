import { db } from "~/server/db";

async function uploadAttributes() {
  const attributes = [
    { label: "Address", type: "string" },
    { label: "Size (SF)", type: "string" },
    { label: "Divisibility (SF)", type: "string" },
    { label: "NNN Asking Rate (SF/Mo)", type: "string" },
    { label: "Opex (SF/Mo)", type: "string" },
    { label: "Direct/Sublease", type: "string" },
    { label: "Comments", type: "string" },
  ];

  for (const attribute of attributes) {
    await db.attribute.create({
      data: {
        label: attribute.label,
        type: attribute.type,
        ownerId: null,
      },
    });
  }
}
void uploadAttributes();
