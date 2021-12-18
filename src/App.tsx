import React, { useEffect } from 'react';
import NussinovPlot from './NussinovPlot';
import 'bootswatch/dist/cerulean/bootstrap.css';

const App = function App() {
  const [bases, setBases] = React.useState('');
  const [pairs, setPairs] = React.useState<[number, number][]>([]);

  useEffect(() => {
    // Called on component load
    setPairs([[0, 5], [1, 2], [3, 4], [6, 10], [8, 9]]);
    setBases('GAUUACAGAUU');
  }, []);

  /**
   * Sets the graph as a new set of bases
   * @param newBases List of bases, as a string
   */
  function updateBases(newBases: string) {
    // TODO: Check if bases pass checks
    // TODO: Set pairs based on Nussinov algorithm output
    setPairs([[0, 5], [1, 2], [3, 4], [6, 10], [8, 9]]);
    setBases(newBases);
  }

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
    </div>
  );
};

export default App;
