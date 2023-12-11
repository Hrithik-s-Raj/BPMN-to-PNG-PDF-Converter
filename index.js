

// const {
//     convertAll
//   } = require('bpmn-to-image');
  
// let inputpath="./b.bpmn"

// async function main(){
//   await convertAll([
//     {
//       input: inputpath,
//       outputs: [
//         'diagram.pdf',
//         'diagram.png'

//       ]
//     }
//   ]);
// }

// main()

// const fs = require('fs');
// const path = require('path');
// const { convertAll } = require('bpmn-to-image');

// const inputDirectory = './bpmnfiles/';
// const outputDirectory = './output/';

// async function convertBPMNFiles() {
//   if (!fs.existsSync(outputDirectory)) {
//     fs.mkdirSync(outputDirectory);
//   }

//   const files = fs.readdirSync(inputDirectory);

//   const bpmnFiles = files.filter((file) => file.endsWith('.bpmn'));

//   for (const bpmnFile of bpmnFiles) {
//     const inputPath = path.join(inputDirectory, bpmnFile);
    
//     const outputPathPDF = path.join(outputDirectory, `${path.parse(bpmnFile).name}.pdf`);
//     const outputPathPNG = path.join(outputDirectory, `${path.parse(bpmnFile).name}.png`);

//     await convertAll([
//       {
//         input: inputPath,
//         outputs: [outputPathPDF, outputPathPNG],
//       }
//     ]);

//     console.log(`Conversion complete for ${bpmnFile}`);
//   }
// }

// convertBPMNFiles();


const fs = require('fs');
const path = require('path');
const { convertAll } = require('bpmn-to-image');

const inputDirectory = './bpmnfiles/';
const outputDirectory = './output/';
const skippedFiles = [];

async function convertBPMNFiles() {
  // Ensure the output directory exists, create it if not.
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
  }

  // Read all files in the input directory.
  const files = fs.readdirSync(inputDirectory);

  // Filter out non-BPMN files if needed.
  const bpmnFiles = files.filter((file) => file.endsWith('.bpmn'));

  // Loop through BPMN files and convert each one.
  for (const bpmnFile of bpmnFiles) {
    try {
      const inputPath = path.join(inputDirectory, bpmnFile);

      // Define the output paths with the same file name but different extensions.
      const outputPathPDF = path.join(outputDirectory, `${path.parse(bpmnFile).name}.pdf`);
      const outputPathPNG = path.join(outputDirectory, `${path.parse(bpmnFile).name}.png`);

      // Convert the BPMN file to PDF and PNG.
      await convertAll([
        {
          input: inputPath,
          outputs: [outputPathPDF, outputPathPNG],
        }
      ]);

      console.log(`Conversion complete for ${bpmnFile}`);
    } catch (error) {
      console.error(`Error converting ${bpmnFile}: ${error.message}`);
      skippedFiles.push(bpmnFile);
    }
  }

  if (skippedFiles.length > 0) {
    console.log('\nSkipped files:');
    skippedFiles.forEach((file) => console.log(file));
  }
}

convertBPMNFiles();
