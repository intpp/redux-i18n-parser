import commandLineArgs from 'command-line-args';
import config from './config';
import { parseTranslationsConfig, parseTranslations, saveTranslations } from './utils';

const params = commandLineArgs(config.commandLineArgs);

if (!params.config) {
  throw new Error('Missing required argument "config"');
}

const translationsConfig = parseTranslationsConfig(params.config);

parseTranslations(translationsConfig.sourceDir, config.regex)
  .then(translations => saveTranslations(translations, translationsConfig));