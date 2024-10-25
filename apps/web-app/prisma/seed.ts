import { db } from "~/server/db";

async function seedAttributes() {
  const attributes = [
    { id: "displayAddress", label: "Address", defaultVisible: true },
    { id: "address", label: "Full address (hidden)", defaultVisible: true },
    { id: "size", label: "Available space (SF)", defaultVisible: true },
    { id: "divisibility", label: "Divisibility (SF)", defaultVisible: true },
    { id: "askingRate", label: "Asking rate (SF/Mo)", defaultVisible: true },
    { id: "opEx", label: "Opex (SF/Mo)", defaultVisible: true },
    { id: "totalCost", label: "All-in cost", defaultVisible: true },
    { id: "directSublease", label: "Direct/Sublease", defaultVisible: true },
    { id: "comments", label: "Comments", defaultVisible: true },
  ];

  await db.$transaction(async (tx) => {
    await tx.attribute.deleteMany({ where: { ownerId: null } });
    await Promise.all(
      attributes.map((attribute, i) =>
        tx.attribute.create({
          data: {
            id: attribute.id,
            label: attribute.label,
            defaultIndex: i,
            defaultVisible: true,
            ownerId: null,
          },
        }),
      ),
    );
  });
}
void seedAttributes();
