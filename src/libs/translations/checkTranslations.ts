const fs = require('fs');
const path = require('path');
const { TRANSLATION_VERSION } = require('../src/libs/translations/version');

function checkTranslationChanges() {
  const translationsDir = path.join(__dirname, '../public/locales');
  const languages = ['es']; // Add more language codes if needed

  let hasTranslationChanges = false;
  let hasVersionChanges = false;

  languages.forEach((language) => {
    const translationFilePath = path.join(
      translationsDir,
      language,
      'translation.json'
    );

    try {
      const translationFile = fs.readFileSync(translationFilePath, 'utf-8');
      const translationData = JSON.parse(translationFile);

      if (translationData.version !== TRANSLATION_VERSION) {
        hasTranslationChanges = true;
        if (!hasVersionChanges) {
          console.log('Please update version number');
        }
      }
    } catch (error) {
      console.error(
        `Error reading translation file for language ${language}:`,
        error
      );
    }
  });

  if (hasTranslationChanges && hasVersionChanges) {
    console.log('Translation changes and version number update detected');
    process.exit(0); // Job success
  } else {
    process.exit(1); // Job failure
  }
}

checkTranslationChanges();
export {};
