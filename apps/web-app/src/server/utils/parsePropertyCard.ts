import { z } from "zod";

export type ParsedPropertyCard = z.infer<typeof parsedPropertyCardSchema>;
export const parsedPropertyCardSchema = z.object({
  address: z.string(),
  propertyType: z.string(),
  listId: z.string(),
  floorSuite: z.string(),
  availDate: z.string(),
  subtypeClass: z.string(),
  spaceUse: z.string(),
  leaseType: z.string(),
  size: z.string(),
  availSpace: z.string(),
  subExpDate: z.string(),
  totalFloors: z.string(),
  vacantSpace: z.string(),
  leaseRate: z.string(),
  constructionStatus: z.string(),
  minDivisible: z.string(),
  maxDivisible: z.string(),
  opEx: z.string(),
  yearBuilt: z.string(),
  parkingRatio: z.string(),
  comments: z.string(),
})


export function parsePropertyCard(text: string) {
  const propertyObj: Partial<ParsedPropertyCard> = {}
  const lines = text.split("\n");
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 1; i < lines.length; i++) {
    let line = lines[i] ?? "";
    const nextLine = lines[i + 1] ?? "";

    if (!propertyObj.address) {
      propertyObj.address = "";
      while (true) {
        if (line.startsWith("Property Type") || line.startsWith("List ID") || i >= lines.length) {
          break;
        }
        propertyObj.address += line + "\n";
        i++
        line = lines[i] ?? "";
      }
    } 
    else if (line.startsWith("Property Type: ")) {
      propertyObj.propertyType = line?.split(":")[1]?.trim();
    }
    else if (line.startsWith("Floor/Suite:") && !propertyObj.floorSuite && !nextLine.startsWith("Avail Date:")) {
      propertyObj.floorSuite = nextLine.trim();
      i++
    }
    else if (line.startsWith("Avail Date:") && !propertyObj.availDate && !nextLine.startsWith("Subtype/Class:")) {
      propertyObj.availDate = nextLine.trim();
      i++
    }
    else if (line.startsWith("Subtype/Class:") && !propertyObj.subtypeClass) {
      propertyObj.subtypeClass = line?.split(":")[1]?.trim();
    }
    else if (line.startsWith("Space Use:") && !propertyObj.spaceUse && !nextLine.startsWith("Lease Type:")) {
      propertyObj.spaceUse = line?.split(":")[1]?.trim();
    } 
    else if (line.startsWith("Lease Type:") && !propertyObj.leaseType && !nextLine.startsWith("Property Size:")) {
      propertyObj.leaseType = nextLine.trim();
      i++
    }
    else if (line.startsWith("Property Size:") && !propertyObj.size) {
      propertyObj.size = line?.split(":")[1]?.trim();
      i++
    }
    else if (line.startsWith("Avail Space:") && !propertyObj.availSpace && !nextLine.startsWith("Sub Exp Date:")) {
      propertyObj.availSpace = nextLine.trim();
      i++
    }
    else if (line.startsWith("Sub Exp Date:") && !propertyObj.subExpDate) {
      propertyObj.subExpDate = line?.split(":")[1]?.trim();
    }
    else if (line.startsWith("Total Floors:") && !propertyObj.totalFloors) {
      propertyObj.totalFloors = line?.split(":")[1]?.trim();
    }
    else if (line.startsWith("Vacant Space:") && !propertyObj.vacantSpace) {
      propertyObj.vacantSpace = line?.split(":")[1]?.trim();
    }
    else if (line.startsWith("Lease Rate:") && !propertyObj.leaseRate && !nextLine.startsWith("Const. Status:")) {
      propertyObj.leaseRate = nextLine.trim();
    }
    else if (line.startsWith("Const. Status:") && !propertyObj.constructionStatus) {
      propertyObj.constructionStatus = line?.split(":")[1]?.trim();
    }
    else if (line.startsWith("Min Divisible:") && !propertyObj.minDivisible) {
      propertyObj.minDivisible = line?.split(":")[1]?.trim();
    }
    else if (line.startsWith("Expenses:") && !propertyObj.opEx && !nextLine.startsWith("Year Built:")) {
      propertyObj.opEx = nextLine.trim();
      i++
    }
    else if (line.startsWith("Year Built:") && !propertyObj.yearBuilt && !nextLine.startsWith("Max Divisible:")) {
      propertyObj.yearBuilt = nextLine.trim();
    }
    else if (line.startsWith("Max Divisible:") && !propertyObj.maxDivisible) {
      propertyObj.maxDivisible = line?.split(":")[1]?.trim();
    } 
    else if (line.startsWith("Parking Ratio:") && !propertyObj.parkingRatio) {
      propertyObj.parkingRatio = line?.split(":")[1]?.trim();
    }
    else if (line.startsWith("Comments:") && !propertyObj.comments) {
      propertyObj.comments = line?.split(":")[1] + "\n";
      i++
      line = lines[i] ?? "";
      while (!line.startsWith("View Flyer") && !line.startsWith("Reproduction in whole or part is permitted only") && i < lines.length) {
        propertyObj.comments += line + "\n";
        i++
        line = lines[i] ?? "";
      }
    }
  }
  return propertyObj;
}



const text = `69.
585 Hamilton Avenue Palo Alto, CA 94301
Palo Alto - Downtown
List ID: 12783946 | 09/04/2024
Property Type: Office
Floor/Suite:
/P1 & P2
Avail Date:
03/01/2022
Subtype/Class: A
Space Use:
Office
Lease Type:
Direct Lease
Property Size: 8,513 rsf
Avail Space:
8,513 rsf
Sub Exp Date:N/A
Bldg Total Flrs: 3
Vacant Space: 8,513 rsf
Lease Rate:
$9.75 NNN
Const. Status: Completed
Min Divisible: 4,169 rsf
Expenses:
$2.11
Year Built:
2022
Max Divisible: 8,513 rsf
Parking Ratio: 3
Comments: - Divisible by Floor to 4,169 sf and 4,344 sf
- New Class A+ construction
- 47,000 SF mixed use development with 19 luxury apartment homes
- Incomparable downtown Palo Alto location
- Building signage opportunity
- Secure separate entrance and access for office tenant
- Ample underground secured parking with 2 EV charging stations solely for office tenant’s use
- Bike storage
- Expansive landscaping creating a tranquil environment while also providing privacy
- Two private outdoor landscaped terraces exclusive for office tenant’s use
- Warm shell condition
View Flyer
Reproduction in whole or part is permitted only with the written consent of Newmark. Some of the data in this report has been gathered from third party sources and has not been
independently verified by Newmark, which therefore makes no warranties or representations as to the completeness or accuracy of any information contained in this report. You are
advised to investigate all such information, and to verify its completeness and accuracy, before making any use thereof or any reliance thereon.
Page 23 of 24
`

function test() {
  const propertyObj = parsePropertyCard(text);
  console.log(propertyObj);
}

test()