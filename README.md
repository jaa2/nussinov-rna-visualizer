# Nussinov RNA Visualizer
Nussinov RNA Visualizer is a web application that shows the Nussinov plot and
force-directed graph of the secondary structure of RNA strands. It also shows
the dot-parentheses format of the Nussinov algorithm output.

The application is hosted on GitHub Pages, where you can access it in your browser. 

[View Nussinov RNA Visualizer online](https://jaa2.github.io/nussinov-rna-visualizer/build/index.html)

<p align="center">
  <img src="/docs/images/app-screenshot.png?raw=true" alt="Screenshot of the Nussinov RNA Visualizer" style="height: 300px">
</p>

## Usage
- Type a DNA or RNA string in the input field. FASTA format is also accepted.
- Change the minimum hairpin length, the minimum number of bases between a base pair.
- Drag nodes on the force-directed graph to rearrange them.

## Development
### Install packages
```
npm install
```
### Run the app in development mode
```
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint
errors in the console.

### Run the linter

```
npm run lint -- --fix
```

Runs the linter and fixes errors automatically where possible. The linter
enforces the Airbnb JavaScript Style Guide (with TypeScript bindings).