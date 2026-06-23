const report = require("multiple-cucumber-html-reporter");
const path = require("path");
const fs = require("fs");

const jsonDir = path.join(__dirname, "../cypress/reports/cucumber-json/");
const htmlDir = path.join(__dirname, "../cypress/reports/html/");

// Garante que o diretório JSON exista, senão o gerador pode quebrar
if (!fs.existsSync(jsonDir)) {
  console.log("Nenhum JSON encontrado para gerar relatório. Pasta de JSON não existe:", jsonDir);
  process.exit(0);
}

report.generate({
  jsonDir: jsonDir,
  reportPath: htmlDir,
  metadata: {
    browser: {
      name: "chrome",
      version: "latest",
    },
    device: "Local test machine",
    platform: {
      name: "linux",
      version: "Ubuntu",
    },
  },
  customData: {
    title: "Run info",
    data: [
      { label: "Project", value: "Automação QA Desafio" },
      { label: "Release", value: "1.0.0" },
      { label: "Execution Time", value: new Date().toLocaleString() },
    ],
  },
});

console.log("Relatório HTML gerado em: ", htmlDir);
