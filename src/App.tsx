import React, { useEffect } from 'react';
import NussinovPlot from './NussinovPlot';
import 'bootswatch/dist/cerulean/bootstrap.css';
import nussinov from './nussinov';
import { bioCheck, sanitizeRNAString } from './cleanFastaFile';

const App = function App() {
  const [bases, setBases] = React.useState('');
  const [pairs, setPairs] = React.useState<[number, number][]>([]);
  const [warnings, setWarnings] = React.useState<Array<string>>([]);

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
    const [filteredStr, rnaWarning] = sanitizeRNAString(newBases);
    let rnaWarnings: Array<string> = [];
    if (rnaWarning !== null) {
      rnaWarnings.push(rnaWarning);
    }
    rnaWarnings = rnaWarnings.concat(bioCheck(filteredStr));
    setWarnings(rnaWarnings);
    setPairs(nussinov(filteredStr));
    setBases(filteredStr);
  }

  const warningsElements: Array<JSX.Element> = warnings.map((warningStr) => (
    <div className="alert alert-info">
      {warningStr}
    </div>
  ));

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
      <NussinovPlot key={bases} bases={bases} pairs={pairs} />
      <br />
      {warningsElements}
    </div>
  );
};

export default App;
