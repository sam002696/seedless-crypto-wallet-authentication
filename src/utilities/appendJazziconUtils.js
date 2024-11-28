import { generateJazzicon } from "./jazziconUtils"; // Import the Jazzicon generator

/**
 * Attaches a Jazzicon to a given DOM ref.
 * @param {React.MutableRefObject} ref - The React ref to attach the Jazzicon to.
 * @param {string} address - The Ethereum address to generate the Jazzicon for.
 * @param {number} size - The size of the Jazzicon.
 */
export const appendJazziconToRef = (ref, address, size) => {
  if (!ref || !ref.current) {
    console.warn("Ref is not available to append the Jazzicon.");
    return;
  }

  // Clear existing icon, if any
  while (ref.current.firstChild) {
    ref.current.removeChild(ref.current.firstChild);
  }

  // Generate Jazzicon and append to the ref
  const jazziconElement = generateJazzicon(address, size);
  ref.current.appendChild(jazziconElement);
};
