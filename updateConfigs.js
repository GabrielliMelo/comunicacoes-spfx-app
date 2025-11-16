const fs = require('fs');
const path = require('path');
const appSettings = require('./config/appSettings'); 

function updateJsonFile(filePath, updateFn) {
  const fullPath = path.join(__dirname, filePath);
  let fileContent = {};

  if (fs.existsSync(fullPath)) {
    fileContent = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  }

  const updatedContent = updateFn(fileContent);
  fs.writeFileSync(fullPath, JSON.stringify(updatedContent, null, 2), 'utf8');
  console.log(`Arquivo ${filePath} atualizado com sucesso!`);
}

updateJsonFile('.yo-rc.json', (config) => {
  config["@microsoft/generator-sharepoint"] = {
    ...config["@microsoft/generator-sharepoint"],
    solutionName: appSettings.solutionName,
    solutionShortDescription: appSettings.solutionShortDescription,
    libraryName: appSettings.libraryName,
  };
  return config;
});

updateJsonFile('package.json', (config) => {
  config.name = appSettings.packageName.toLowerCase().replace(/\s+/g, '-');
  return config;
});

updateJsonFile('package-lock.json', (config) => {
  config.name = appSettings.packageName.toLowerCase().replace(/\s+/g, '-');
  if (config.packages && config.packages[""]) {
    config.packages[""].name = appSettings.packageName.toLowerCase().replace(/\s+/g, '-');
  }
  return config;
});

updateJsonFile('config/package-solution.json', (config) => {
  config.solution = {
    ...config.solution,
    name: appSettings.solutionPackageName,
    metadata: {
      ...config.solution?.metadata,
      shortDescription: {
        default: appSettings.shortDescription
      },
      longDescription: {
        default: appSettings.longDescription
      }
    },
    features: [
      {
        ...config.solution?.features?.[0],
        title: appSettings.featureTitle,
      }
    ]
  };
  config.paths = {
    ...config.paths,
    zippedPackage: appSettings.zippedPackagePath
  };
  return config;
});