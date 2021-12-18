import { bioCheck, sanitizeRNAString } from './cleanFastaFile';

test('Sanitize empty string', () => {
  const element = sanitizeRNAString('');
  expect(element).toEqual(['', null]);
});

test('Sanitize to upper RNA string', () => {
  const element = sanitizeRNAString('gacucc');
  expect(element).toEqual(['GACUCC', null]);
});

test('Sanitize to upper DNA string', () => {
  const element = sanitizeRNAString('gactcc');
  expect(element).toEqual(['GACUCC', null]);
});

test('Sanitize catching a number', () => {
  const element = sanitizeRNAString('gac1cc');
  expect(element).toEqual(['GACCC', 'Characters ignored: 1']);
});

test('Sanitize catching a non base pair alpha character', () => {
  const element = sanitizeRNAString('gabcc');
  expect(element).toEqual(['GACC', 'Characters ignored: B']);
});

test('Sanitize catching a non base pair character', () => {
  const element = sanitizeRNAString('gac!cc');
  expect(element).toEqual(['GACCC', 'Characters ignored: !']);
});

test('Sanitize catching many errors', () => {
  const element = sanitizeRNAString('gbac!cc1');
  expect(element).toEqual(['GACCC', 'Characters ignored: B!1']);
});

test('Sanitize on FASTA files', () => {
  const element = sanitizeRNAString('>NC_000007.14:22725889-22732002 IL6 [organism=Homo sapiens] [GeneID=3569] [chromosome=7] ACACCATGTTTGGTAAATAAGTGTTTTGGTTGA');
  expect(element).toEqual(['ACACCAUGUUUGGUAAAUAAGUGUUUUGGUUGA', null]);
});

test('BioCheck check for extraneous protein', () => {
  const element = bioCheck(sanitizeRNAString('cuuaa')[0]);
  expect(element).toEqual(['The RNA sequence is not divisable by 3; therefore the string has an abiguous protein.']);
});

test('BioCheck check for improper end sequence', () => {
  const element = bioCheck(sanitizeRNAString('cuccaa')[0]);
  expect(element).toEqual(['The RNA sequence does not contain a proper end sequence.']);
});

test('BioCheck check for extraneous protein and improper end sequence', () => {
  const element = bioCheck(sanitizeRNAString('gcuccaa')[0]);
  expect(element).toEqual(['The RNA sequence is not divisable by 3; therefore the string has an abiguous protein.', 'The RNA sequence does not contain a proper end sequence.']);
});

test('BioCheck passing sequence', () => {
  const element = bioCheck(sanitizeRNAString('gcutaa')[0]);
  expect(element).toEqual([]);
});
