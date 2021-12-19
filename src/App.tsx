import React, { useEffect } from 'react';
import NussinovPlot from './NussinovPlot';
import ForceGraph from './ForceGraph';
import 'bootswatch/dist/cerulean/bootstrap.css';
import nussinov, { dotParentheses } from './nussinov';
import { bioCheck, sanitizeRNAString } from './cleanFastaFile';

const App = function App() {
  const [bases, setBases] = React.useState('');
  const [pairs, setPairs] = React.useState<[number, number][]>([]);
  const [minHairpin, setMinHairpin] = React.useState<number>();
  const [warnings, setWarnings] = React.useState<Array<string>>([]);
  const [isDNAtoRNA, setIsDNAtoRNA] = React.useState<boolean>(false);
  const [dotParenthesesOutput, setDotParenthesesOutput] = React.useState<string>('');

  /**
   * Sets the graph as a new set of bases
   * @param newBases List of bases, as a string
   */
  function updateBases(newBases: string) {
    const [filteredStr, rnaSanitizeWarns] = sanitizeRNAString(newBases);
    let rnaWarnings: Array<string> = rnaSanitizeWarns;
    rnaWarnings = rnaWarnings.concat(bioCheck(filteredStr));
    setWarnings(rnaWarnings);
    setIsDNAtoRNA(newBases.toUpperCase().includes('T'));
    const newPairs = nussinov(filteredStr, minHairpin);
    setPairs(newPairs);
    setDotParenthesesOutput(dotParentheses(filteredStr.length, newPairs));
    setBases(filteredStr);
  }

  useEffect(() => {
    // Called on component load
    const defaultBases = 'GAUUACAGAUAA';
    const defaultMinHairpin = 2;
    setMinHairpin(defaultMinHairpin);
    updateBases(defaultBases);
  }, []);

  function updateMinHairpin(newMinHairpin: number) {
    const clampedMinHairpin = Math.min(bases.length, Math.max(1, newMinHairpin));
    setMinHairpin(clampedMinHairpin);
    updateBases(bases);
  }

  const warningsElements: Array<JSX.Element> = warnings.map((warningStr) => (
    <div className="alert alert-info">
      {warningStr}
    </div>
  ));

  const dnaToRnaSnippet: JSX.Element = isDNAtoRNA ? <span className="h5 badge bg-primary" style={{ transform: 'scale(0.7)' }}>DNA&#10142;RNA</span> : <span />;

  return (
    <div className="container-sm">
      <h1 className="text-center">Nussinov RNA Secondary Structure Visualizer</h1>
      <p className="text-center">by jaa2, Jpn3, and SethWyma</p>
      <div className="row g-3">
        <div className="col-9">
          <label htmlFor="bases-input" className="form-label">Bases of the RNA strand</label>
          <input className="form-control" id="bases-input" type="text" placeholder="GAUUACAGAUAA..." onChange={(e) => { updateBases(e.target.value); }} />
        </div>
        <div className="col-3">
          <label htmlFor="bases-input" className="form-label">Minimum hairpin length</label>
          <input className="form-control" id="min-hairpin-input" type="number" value={minHairpin} onChange={(e) => { updateMinHairpin(+e.target.value); }} />
        </div>
      </div>

      <br />
      <h3>
        Nussinov Plot
        {dnaToRnaSnippet}
      </h3>
      <NussinovPlot key={`C${bases}_${minHairpin}`} bases={bases} pairs={pairs} />
      <ForceGraph key={`F${bases}_${minHairpin}`} bases={bases} pairs={pairs} />
      <br />
      <h3>Dot-Parentheses Format</h3>
      <div
        className="px-2"
        style={{
          backgroundColor: '#868e96', color: '#dee2e6', fontFamily: 'monospace', borderRadius: '10px', overflowWrap: 'anywhere',
        }}
      >
        {dotParenthesesOutput}
      </div>
      <br />
      {warningsElements}
    </div>
  );
};

export default App;
