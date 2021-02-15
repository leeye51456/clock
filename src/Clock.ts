import { format, Locale } from 'date-fns';
import { LocaleKey, isLocaleKey } from './locale/keys';
import AbstractComponent from './AbstractComponent';

interface OptionalDateTimeFormat {
  date?: string,
  time?: string,
}

interface DateTimeFormat extends OptionalDateTimeFormat {
  date: string,
  time: string,
}

interface ClockOptions {
  format?: OptionalDateTimeFormat,
  locale?: string,
}

// See https://tools.ietf.org/rfc/bcp/bcp47.txt
function toLocaleKey(bcp47Locale: string): LocaleKey {
  const codes: string[] = bcp47Locale.split('-');
  while (codes.length > 0) {
    const partialLocale: string = codes.join('');
    if (isLocaleKey(partialLocale)) {
      return partialLocale;
    }
    codes.pop();
  }
  throw RangeError();
}

class Clock extends AbstractComponent {
  private intervalId: number | null = null;

  private timeSection: HTMLElement = document.createElement('section');
  private dateSection: HTMLElement = document.createElement('section');

  private format: DateTimeFormat = {
    date: 'y-MM-dd',
    time: 'HH:mm:ss',
  };

  private localeKey: LocaleKey = 'enUS';
  private localeObject: Locale | undefined = undefined;

  constructor(options?: ClockOptions) {
    super();

    this.timeSection.classList.add('clock-time');
    this.dateSection.classList.add('clock-date');

    this.format = {
      ...this.format,
      ...options?.format,
    };

    try {
      if (typeof options?.locale === 'string') {
        this.setLocale(options.locale);
      } else {
        this.setLocale(navigator.language);
      }
    } catch (e) {
      // Do nothing
    }
  }

  protected drawChildren(): void {
    if (this.baseNode) {
      this.intervalId = window.setInterval(this.update.bind(this), 1000);
      this.baseNode.append(this.timeSection, this.dateSection);
    }
  }

  protected release(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
    }
  }

  private update(): void {
    const date: Date = new Date();
    const options = { locale: this.localeObject };
    this.timeSection.innerText = format(date, this.format.time, options);
    this.dateSection.innerText = format(date, this.format.date, options);
  }

  setLocale(value: string): void {
    let localeKey: LocaleKey;
    try {
      localeKey = toLocaleKey(value);
    } catch (error) {
      localeKey = 'enUS';
    }

    if (localeKey === 'enUS') {
      this.setLocaleToFallback();
      this.update();
      return;
    }

    import(
      /* webpackChunkName: "locale/[request]" */
      `./locale/modules/${localeKey}`
    )
      .then((module) => {
        this.localeKey = localeKey;
        this.localeObject = module.default;
      })
      .catch(() => this.setLocaleToFallback())
      .then(() => this.update());
  }

  setLocaleToFallback(): void {
    this.localeKey = 'enUS';
    this.localeObject = undefined;
  }
}

export default Clock;
