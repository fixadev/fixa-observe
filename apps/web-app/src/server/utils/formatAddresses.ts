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

export async function formatAddress(address: {
  addressString: string;
  suite: string;
  buildingName: string;
}) {
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

    const { addressLines, locality, postalCode, administrativeArea } =
      response.data.result.address.postalAddress;

    const postalAddress = `${addressLines.join("\n")}\n${
      locality ?? ""
    }, ${administrativeArea ?? ""}\n ${postalCode ?? ""}`;

    const displayAddress = `${address.buildingName ? address.buildingName + "\n" : ""}${addressLines.join("\n")}\n${
      address.suite ? "Suite " + address.suite + "\n" : ""
    }${locality ?? ""}`;

    return {
      postalAddress,
      displayAddress,
    };
  } catch (error) {
    console.error(`Error formatting address`, error);
    return {
      postalAddress: "",
      displayAddress: "",
    };
  }
}

// Example usage:
// async function test() {
//   const address = {
//     addressString: "Atrium Center, 31 North Second Street, San Jose, CA 95112",
//     suite: "Suite 400",
//     buildingName: "Atrium Center",
//   };

//   const formattedAddress = await formatAddress(address);
//   console.log("formattedAddress", formattedAddress);
// }

// void test();
