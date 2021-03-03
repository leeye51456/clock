import { register } from './swManager';
import { ModuleData, initializeFromDatabase } from './db';
import localeKeys, { LocaleKey } from './locale/keys';
import { toBcp47Locale } from './util/LocaleConverter';
import Clock from './component/Clock';
import './index.css';

register();

initializeFromDatabase(
  (key: number, moduleData: ModuleData) => {
    const module = new Clock(moduleData.data, key);
    module.draw(document.querySelector('.clock'));
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
