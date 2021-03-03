import { register } from './swManager';
import { ModuleData, initializeFromDatabase } from './db';
import localeKeys, { LocaleKey } from './locale/keys';
import { toBcp47Locale } from './util/LocaleConverter';
import getModuleByName from './util/getModuleByName';
import Clock from './component/Clock';
import './index.css';

register();

initializeFromDatabase(
  (key: number, moduleData: ModuleData) => {
    const Module = getModuleByName(moduleData.type);
    const module = new Module(moduleData.data, key);
    module.draw(document.querySelector(`.${moduleData.type.toLowerCase()}`));
  },
  () => {
    const clock = new Clock();
    clock.draw(document.querySelector('.clock'));
  }
);

const localesDataList: HTMLDataListElement | null = document.querySelector('datalist#locales');
if (localesDataList) {
  localeKeys.forEach((locale: LocaleKey) => {
    const bcp47Locale: string | null = toBcp47Locale(locale);
    if (bcp47Locale) {
      const localeOption: HTMLOptionElement = document.createElement('option');
      localeOption.value = bcp47Locale;
      localesDataList.appendChild(localeOption);
    }
  });
}
