import React, { useEffect } from 'react';
import NussinovPlot from './NussinovPlot';

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
    <div>
      <h2>Nussinov</h2>
      <p>Our app&apos;s content will go here.</p>
      <input type="text" onChange={(e) => { updateBases(e.target.value); }} />
      <br />
      <NussinovPlot key={bases} bases={bases} pairs={pairs} />
    </div>
  );
};

export default App;
