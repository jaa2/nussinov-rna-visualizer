import React, { useEffect } from 'react';
import NussinovPlot from './NussinovPlot';
import 'bootswatch/dist/cerulean/bootstrap.css';

const App = function App() {
  const [bases, setBases] = React.useState('');
  const [pairs, setPairs] = React.useState<[number, number][]>([]);

  useEffect(() => {
    // Called on component load
    setPairs([[0, 6], [1, 5], [2, 4], [7, 10], [8, 9]]);
    setBases('GATTATCAATTACA');
  }, []);

  /**
   * Sets the graph as a new set of bases
   * @param newBases List of bases, as a string
   */
  function updateBases(newBases: string) {
    // TODO: Check if bases pass checks
    // TODO: Set pairs based on Nussinov algorithm output
    setPairs([[0, 6], [1, 5], [2, 4], [7, 10], [8, 9]]);
    setBases(newBases);
  }

  return (
    <div className="container-lg">
      <h1 className="text-center">Nussinov RNA Secondary Structure Visualizer</h1>
      <p className="text-center">by jaa2, Jpn3, and SethWyma</p>
      <div className="mb-3">
        <label htmlFor="basesEntry" className="form-label">
          Bases of the RNA strand
          <input className="form-control" id="basesEntry" type="text" placeholder="GAUAUCGC..." onChange={(e) => { updateBases(e.target.value); }} />
        </label>
      </div>
      <br />
      <NussinovPlot key={bases} bases={bases} pairs={pairs} />
    </div>
  );
};

export default App;
