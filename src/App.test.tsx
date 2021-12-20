import { bioCheck, mixedInputMessage, sanitizeRNAString } from './cleanFastaFile';
import { dotParentheses } from './nussinov';

test('Sanitize empty string', () => {
  const element = sanitizeRNAString('');
  expect(element).toEqual(['', []]);
});

test('Sanitize to upper RNA string', () => {
  const element = sanitizeRNAString('gacucc');
  expect(element).toEqual(['GACUCC', []]);
});

test('Sanitize to upper DNA string', () => {
  const element = sanitizeRNAString('gactcc');
  expect(element).toEqual(['GACUCC', []]);
});

test('Sanitize catching a number', () => {
  const element = sanitizeRNAString('gac1cc');
  expect(element).toEqual(['GACCC', ['Characters ignored: 1']]);
});

test('Sanitize catching a non base pair alpha character', () => {
  const element = sanitizeRNAString('gabcc');
  expect(element).toEqual(['GACC', ['Characters ignored: B']]);
});

test('Sanitize catching a non base pair character', () => {
  const element = sanitizeRNAString('gac!cc');
  expect(element).toEqual(['GACCC', ['Characters ignored: !']]);
});

test('Sanitize catching many errors', () => {
  const element = sanitizeRNAString('gbac!cc1');
  expect(element).toEqual(['GACCC', ['Characters ignored: B!1']]);
});

test('Whitespace produces no warnings', () => {
  const element = sanitizeRNAString('   G\n\n\nAGAGAGAG    AGAGAGA   GUUAA   ');
  expect(element).toEqual(['GAGAGAGAGAGAGAGAGUUAA', []]);
});

test('Sanitize on FASTA files', () => {
  const element = sanitizeRNAString('>NC_000023.11:12867072-12890361 TLR7 [organism=Homo sapiens] [GeneID=51284] [chromosome=X]\nACTTCATCTCAGAAGACTCCAGATATAGGATCACTCCATGCCATCAAGAAAGGTATTTTAAACATTGGAA\nCACATATAGATAATTTAAGTAGGTAGATGTATGTGCTGTTATAAGGAAGTGGGGAGGAGAGAAGAGGGAA\nCCGAAATCATATGCACAAAAATTTTTTTTAGAATATAAATAAAAAATGTGGTAGTCTAAAATGTCAATTC\nTTCAAAGATAAAGTTAGGCTTTCAGTAACGTTAGAAATGGTTTTCTGGAATATGTCTCCAGTCTACCTAA\n');

  expect(element).toEqual(['ACUUCAUCUCAGAAGACUCCAGAUAUAGGAUCACUCCAUGCCAUCAAGAAAGGUAUUUUAAACAUUGGAACACAUAUAGAUAAUUUAAGUAGGUAGAUGUAUGUGCUGUUAUAAGGAAGUGGGGAGGAGAGAAGAGGGAACCGAAAUCAUAUGCACAAAAAUUUUUUUUAGAAUAUAAAUAAAAAAUGUGGUAGUCUAAAAUGUCAAUUCUUCAAAGAUAAAGUUAGGCUUUCAGUAACGUUAGAAAUGGUUUUCUGGAAUAUGUCUCCAGUCUACCUAA', []]);
});

test('Mixed DNA/RNA bases input', () => {
  expect(sanitizeRNAString('TUA')).toEqual(['UUA', [mixedInputMessage]]);
});

test('BioCheck check for extraneous protein', () => {
  const element = bioCheck(sanitizeRNAString('cuuaa')[0]);
  expect(element).toEqual(['The RNA sequence is not divisible by 3; the string has an ambiguous protein.']);
});

test('BioCheck check for improper end sequence', () => {
  const element = bioCheck(sanitizeRNAString('cuccaa')[0]);
  expect(element).toEqual(["None of the end codons ('UAA,' 'UAG,' or 'UGA') were found at the end of the input."]);
});

test('BioCheck check for extraneous protein and improper end sequence', () => {
  const element = bioCheck(sanitizeRNAString('gcuccaa')[0]);
  expect(element).toEqual(['The RNA sequence is not divisible by 3; the string has an ambiguous protein.', "None of the end codons ('UAA,' 'UAG,' or 'UGA') were found at the end of the input."]);
});

test('BioCheck passing sequence', () => {
  const element = bioCheck(sanitizeRNAString('gcutaa')[0]);
  expect(element).toEqual([]);
});

test('Dot parentheses format', () => {
  expect(dotParentheses(5, [[0, 1]])).toEqual('()...');
  expect(dotParentheses(2, [[0, 1]])).toEqual('()');
  expect(dotParentheses(5, [[0, 4]])).toEqual('(...)');
  expect(dotParentheses(6, [])).toEqual('......');
  expect(dotParentheses(6, [[0, 2], [3, 4]])).toEqual('(.)().');
});
