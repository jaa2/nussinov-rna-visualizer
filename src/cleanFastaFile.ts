// Message if both DNA and RNA bases are included
export const mixedInputMessage: string = 'Both DNA bases (T) and RNA bases (U) found in input. Mixed input not expected.';

/**
 * Sanitizes an string of RNA bases and converts DNA to RNA.
 * @param data An RNA string, a DNA string, or a FASTA file type string
 * @returns an array containing the cleaned RNA string and all warning messages
 */
export function sanitizeRNAString(data: string): [string, string[]] {
  // identify and clean fasta file
  let basePairsStr:string = '';
  if (data[0] === '>') {
    const fasta: string[] = data.split('\n');
    fasta.splice(0, 1);
    basePairsStr = fasta.toString();
  } else {
    basePairsStr = data;
  }

  basePairsStr = basePairsStr.toUpperCase();

  const messages: string[] = [];

  // Check if DNA and RNA are both (possibly) present
  if (basePairsStr.includes('T') && basePairsStr.includes('U')) {
    messages.push(mixedInputMessage);
  }

  // Converts DNA to RNA
  basePairsStr = basePairsStr.replace(/T/g, 'U');
  const rnaStr = basePairsStr.replaceAll(/[^GACU]/g, '');

  if (rnaStr.length !== basePairsStr.length) {
    // We are ignoring some characters
    const message = `Characters ignored: ${basePairsStr.replaceAll(/[GACU]/g, '')}`;
    messages.push(message);
  }

  // No characters are ignored
  return [rnaStr, messages];
}

/**
 * This function checks for some common RNA string errors and then returns an array that notes them
 * @param data A cleaned string from the sanitizeRNAString function
 * @returns an array of the potential errors of the passed RNA string
 */
export function bioCheck(data: string): string[] {
  if (data.length === 0) {
    return [];
  }
  const messages: string[] = [];
  if (data.length % 3 !== 0) {
    messages.push('The RNA sequence is not divisible by 3; the string has an ambiguous protein.');
  }
  if (data.length >= 3) {
    let end = '';
    end = end.concat(
      (data[data.length - 3]).toString(),
      (data[data.length - 2]).toString(),
      (data[data.length - 1]).toString(),
    );
    if (!(end === 'UAA' || end === 'UAG' || end === 'UGA')) {
      messages.push('The RNA sequence does not contain a proper end sequence.');
    }
  }
  return (messages);
}
