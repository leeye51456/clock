import { format, Locale } from 'date-fns';
import localeKeys from './locale/keys';
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
function toLocaleKey(bcp47Locale: string): string {
  const codes: string[] = bcp47Locale.split('-');
  while (codes.length > 0) {
    const partialLocale = codes.join('');
    if (localeKeys.has(partialLocale)) {
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

  private localeKey: string = 'enUS';
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
      this.update();
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
    try {
      this.localeKey = toLocaleKey(value);
    } catch (error) {
      this.localeKey = 'enUS';
    }

    if (this.localeKey === 'enUS') {
      this.localeObject = undefined;
      this.update();
      return;
    }

    // TODO - Remove flashing language
    import(
      /* webpackChunkName: "locale/[request]" */
      `./locale/modules/${this.localeKey}`
    )
      .then((module) => {
        this.localeObject = module.default;
      })
      .catch(() => {
        this.localeObject = undefined;
      })
      .then(() => this.update());
  }
}

export default Clock;
