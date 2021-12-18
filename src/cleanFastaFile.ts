/**
 * Sanitizes an string of RNA bases and converts DNA to RNA.
 * @param data An RNA string, a DNA string, or a FASTA file type string
 * @returns an array containing the cleaned RNA string and an optional message
 */
export function sanitizeRNAString(data: string): [string, string | null] {
  const dataArr: string[] = data.split(' ');
  let data2:string = dataArr[dataArr.length - 1];
  data2 = data2.toUpperCase();

  // Converts DNA to RNA
  data2 = data2.replace(/T/g, 'U');

  const rnaStr = data2.replaceAll(/[^GACU]/g, '');

  if (rnaStr.length !== data2.length) {
    // We are ignoring some characters
    const message = `Characters ignored: ${data2.replaceAll(/[GACU]/g, '')}`;
    return [rnaStr, message];
  }

  // No characters are ignored
  return [rnaStr, null];
}

/**
 * This function checks for some common RNA string errors and then returns an array that notes them
 * @param data A cleaned string from the sanitizeRNAString function
 * @returns an array of the potential errors of the passed RNA string
 */
export function bioCheck(data: string): string[] {
  const messages: string[] = [];
  if (data.length % 3 !== 0) {
    messages.push('The RNA sequence is not divisable by 3; therefore the string has an abiguous protein.');
  }
  let end = '';
  end = end.concat(
    (data[data.length - 3]).toString(),
    (data[data.length - 2]).toString(),
    (data[data.length - 1]).toString(),
  );
  if (!(end === 'UAA' || end === 'UAG' || end === 'UGA')) {
    messages.push('The RNA sequence does not contain a proper end sequence.');
  }
  return (messages);
}
