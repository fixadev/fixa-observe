import axios from "axios";
import { env } from "~/env";

interface AddressValidationResponse {
  result: {
    address: {
      formattedAddress: string;
      postalAddress: {
        addressLines: string[];
      };
    };
  };
}

export async function formatAddresses(addresses: string[]) {
  const formatPromises = addresses.map(async (address) => {
    try {
      const addressLines = address
        .split("\n")
        .filter((line) => line.trim() !== "");
      const response = await axios.post<AddressValidationResponse>(
        "https://addressvalidation.googleapis.com/v1:validateAddress",
        {
          address: {
            regionCode: "US",
            addressLines: address,
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

      console.log("response", JSON.stringify(response.data, null, 2));

      const formattedAddress = response.data.result.address.formattedAddress;
      const streetAddress =
        response.data.result.address.postalAddress.addressLines.join("\n");

      return {
        address: formattedAddress,
        displayAddress:
          streetAddress + "\n" + (addressLines[addressLines.length - 1] ?? ""),
      };
    } catch (error) {
      console.error(`Error formatting address: ${address}`, error);
      return {
        address: address,
        displayAddress: address,
      };
    }
  });

  return Promise.all(formatPromises);
}

// async function test() {
//   const addresses = [
//     "Town & Country Village\n855 El Camino Real Palo Alto, CA 94301\nPalo Alto - California Avenue",
//     "550 Lytton Avenue Palo Alto, CA 94301\n Palo Alto - California Avenue",
//     // "2335 El Camino Real Palo Alto, CA 94306",
//     // "409 Sherman Avenue Palo Alto, CA 94306",
//   ];

//   const formattedAddresses = await formatAddresses(addresses);

//   console.log("formattedAddresses", formattedAddresses);
// }

// void test();
