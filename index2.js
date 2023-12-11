import fs from 'fs';
import path from 'path';
import { convertAll } from 'bpmn-to-image';
import puppeteer from 'puppeteer';

const inputDirectory = './bpmn2/';
const outputDirectory = './bpmnfiles2/';
const skippedFiles = [];

async function convertBPMNFiles() {
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
  }

  const files = fs.readdirSync(inputDirectory);
  const bpmnFiles = files.filter((file) => file.endsWith('.bpmn'));

  for (const bpmnFile of bpmnFiles) {
    try {
      const inputPath = path.join(inputDirectory, bpmnFile);
      const outputPathPDF = path.join(outputDirectory, `${path.parse(bpmnFile).name}.pdf`);
      const outputPathPNG = path.join(outputDirectory, `${path.parse(bpmnFile).name}.png`);

      await convertAll([
        {
          input: inputPath,
          outputs: [outputPathPDF],
        }
      ]);

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto(`file://${outputPathPDF}`, { waitUntil: 'domcontentloaded' });
      await page.screenshot({ path: outputPathPNG });

      await browser.close();

      console.log(`Conversion complete for ${bpmnFile}`);
    } catch (error) {
      console.error(`Error converting ${bpmnFile}: ${error.message}`);
      skippedFiles.push({ file: bpmnFile, error: error.message });
    }
  }

  if (skippedFiles.length > 0) {
    console.log('\nSkipped files:');
    skippedFiles.forEach((entry) => console.log(`${entry.file} - ${entry.error}`));
  }
}

convertBPMNFiles();
