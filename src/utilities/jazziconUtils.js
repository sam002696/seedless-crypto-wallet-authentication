import jazzicon from "@metamask/jazzicon";

/**
 * Generates a Jazzicon element for a given Ethereum address and size.
 * @param {string} address - The Ethereum address to generate the Jazzicon for.
 * @param {number} size - The size of the Jazzicon.
 * @returns {HTMLElement} - The generated Jazzicon element.
 */
export const generateJazzicon = (address, size) => {
  if (!address) {
    throw new Error("Address is required to generate a Jazzicon.");
  }

  // Use a portion of the address to create a deterministic seed
  const seed = parseInt(address.slice(2, 10), 16);

  // Return the Jazzicon DOM element
  return jazzicon(size, seed);
};
