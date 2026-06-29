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
//script para gerar um relatório HTML visual para os testes.
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

const indexHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QA Automation Dashboard</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #121212; color: #ffffff; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        h1 { font-size: 2.5rem; margin-bottom: 40px; color: #4CAF50; }
        .btn-container { display: flex; gap: 20px; }
        .btn { padding: 15px 30px; font-size: 1.2rem; text-decoration: none; border-radius: 8px; transition: transform 0.2s, background-color 0.2s; font-weight: bold; }
        .btn-web { background-color: #2b3137; color: #ffffff; border: 2px solid #58a6ff; }
        .btn-web:hover { background-color: #58a6ff; color: #ffffff; transform: translateY(-3px); }
        .btn-api { background-color: #2b3137; color: #ffffff; border: 2px solid #ff7b72; }
        .btn-api:hover { background-color: #ff7b72; color: #ffffff; transform: translateY(-3px); }
    </style>
</head>
<body>
    <h1>QA Automation Dashboard</h1>
    <div class="btn-container">
        <a href="html/index.html" class="btn btn-web">🌐 Testes E2E (Web)</a>
        <a href="api/index.html" class="btn btn-api">⚡ Testes de API (Jest)</a>
    </div>
</body>
</html>
`;

fs.writeFileSync(
  path.join(__dirname, '../cypress/reports/index.html'),
  indexHtmlContent
);

console.log('=====================================================================================');
console.log('    Dashboard unificado gerado em:');
console.log('');
console.log(`    ${path.join(__dirname, '../cypress/reports/index.html')}`);
console.log('=====================================================================================');
console.log("Relatório HTML gerado em: ", htmlDir);
