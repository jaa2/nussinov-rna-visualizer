import React, { useEffect } from 'react';
import NussinovPlot from './NussinovPlot';
import 'bootswatch/dist/cerulean/bootstrap.css';
import nussinov from './nussinov';
import { bioCheck, sanitizeRNAString } from './cleanFastaFile';

const App = function App() {
  const [bases, setBases] = React.useState('');
  const [pairs, setPairs] = React.useState<[number, number][]>([]);
  const [warnings, setWarnings] = React.useState<Array<string>>([]);
  const [isDNAtoRNA, setIsDNAtoRNA] = React.useState<boolean>(false);

  useEffect(() => {
    // Called on component load
    const defaultBases = 'GAUUACAGAUU';
    setPairs(nussinov(defaultBases));
    setBases(defaultBases);
  }, []);

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
    setPairs(nussinov(filteredStr));
    setBases(filteredStr);
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
      <div className="mb-3">
        <label htmlFor="bases-input">
          <div className="form-label">
            Bases of the RNA strand
          </div>
        </label>
        <input className="form-control" id="bases-input" type="text" placeholder="GAUUACAGAUU..." onChange={(e) => { updateBases(e.target.value); }} />
      </div>
      <br />
      <h3>
        Nussinov Plot
        {dnaToRnaSnippet}
      </h3>
      <NussinovPlot key={bases} bases={bases} pairs={pairs} />
      <br />
      {warningsElements}
    </div>
  );
};

export default App;
