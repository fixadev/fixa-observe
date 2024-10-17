import axios from 'axios';
import { env } from '~/env';

interface AddressValidationResponse {
  result: {
    address: {
      formattedAddress: string;
    };
  };
}

export async function formatAddresses(addresses: string[]) {
    const formattedAddresses = []
    for (const address of addresses) {
    const addressLines = address.split("\n");
    const response = await axios.post<AddressValidationResponse>(
      "https://addressvalidation.googleapis.com/v1:validateAddress",
      {
        address: {
          regionCode: "US",
          addressLines: [addressLines[0] ?? ""]
        }
      },
      {
        params: {
          key: env.GOOGLE_API_KEY
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const formattedFirstLine = response.data.result.address.formattedAddress
    formattedAddresses.push(formattedFirstLine + "\n" + (addressLines[1] ?? ""))
  }

  return formattedAddresses
}


// async function test() {
//   const addresses = [
//     "550 Lytton Avenue Palo Alto, CA 94301\n Palo Alto - California Avenue",
//     "2335 El Camino Real Palo Alto, CA 94306",
//     "409 Sherman Avenue Palo Alto, CA 94306",
//   ]

//   const formattedAddresses = await formatAddresses(addresses)

//   console.log('formattedAddresses', formattedAddresses)
  
// }

// void test()



