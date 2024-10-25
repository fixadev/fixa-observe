import axios from "axios";
import { env } from "~/env";

interface AddressValidationResponse {
  result: {
    address: {
      formattedAddress: string;
      postalAddress: {
        addressLines: string[];
        locality: string;
        postalCode: string;
        administrativeArea: string;
      };
      addressComponents: {
        componentName: {
          text: string;
          languageCode: string;
        };
        componentType: string;
      }[];
    };
  };
}

export async function formatAddresses(
  addresses: Array<{
    addressString: string;
    suite: string;
    buildingName: string;
  }>,
) {
  const formatPromises = addresses.map(async (address) => {
    try {
      const response = await axios.post<AddressValidationResponse>(
        "https://addressvalidation.googleapis.com/v1:validateAddress",
        {
          address: {
            regionCode: "US",
            addressLines: address.addressString,
          },
        },
        {
          params: {
            key: env.GOOGLE_API_KEY,
          },
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // console.log(
      //   "response",
      //   JSON.stringify(response.data.result.address, null, 2),
      // );

      const { addressLines, locality, postalCode, administrativeArea } =
        response.data.result.address.postalAddress;

      const fullAddress = `${addressLines.join("\n")}\n${locality}, ${administrativeArea}\n ${postalCode}`;

      const displayAddress = `${address.buildingName ? address.buildingName + "\n" : ""}${addressLines.join("\n")}\n${
        address.suite ? "Suite " + address.suite + "\n" : ""
      }${locality}`;

      return {
        address: fullAddress,
        displayAddress,
      };
    } catch (error) {
      console.error(`Error formatting address: ${address}`, error);
      return {
        address: "",
        displayAddress: "",
      };
    }
  });

  return Promise.all(formatPromises);
}

// async function test() {
//   const addresses = [
//     // "Town & Country Village\n855 El Camino Real Palo Alto, CA 94301\nPalo Alto - California Avenue",
//     // "550 Lytton Avenue Palo Alto, CA 94301\n Palo Alto - California Avenue",
//     // "2335 El Camino Real Palo Alto, CA 94306",
//     // "409 Sherman Avenue Palo Alto, CA 94306",
//     // "96 N Third Street San Jose, CA 95112-5589",
//     {
//       addressString:
//         "Atrium Center, 31 North Second Street, San Jose, CA 95112",
//       suite: "Suite 400",
//       buildingName: "Atrium Center",
//     },
//   ];

//   const formattedAddresses = await formatAddresses(addresses);

//   // console.log("formattedAddresses", formattedAddresses);
// }

// void test();
