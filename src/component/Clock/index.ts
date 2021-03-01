import { format, Locale } from 'date-fns';
import { LocaleKey } from '../../locale/keys';
import AbstractComponent from '../AbstractComponent';
import ClockSettingsModal from '../modal/ClockSettingsModal';
import { toBcp47Locale, toDateFnsLocaleKey } from '../../util/LocaleConverter';
import './index.css';

export type DateTimeFormat = {
  date: string;
  time: string;
};

type ClockOptions = {
  format: DateTimeFormat;
  locale: LocaleKey;
};

class Clock extends AbstractComponent {
  private intervalId: number | null = null;

  private timeSection: HTMLElement = document.createElement('section');
  private dateSection: HTMLElement = document.createElement('section');

  private format: DateTimeFormat = {
    date: 'PPPP',
    time: 'pp',
  };

  private localeKey: LocaleKey = 'enUS';
  private localeObject: Locale | undefined = undefined;

  constructor(options?: ClockOptions) {
    super();

    this.handleClick = this.handleClick.bind(this);

    this.timeSection.classList.add('clock-time');
    this.dateSection.classList.add('clock-date');

    if (options) {
      this.format = { ...options.format };
    }

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
      this.baseNode.addEventListener('click', this.handleClick);
      this.intervalId = window.setInterval(this.update.bind(this), 1000);
      this.baseNode.append(this.timeSection, this.dateSection);
    }
  }

  protected release(): void {
    if (this.baseNode && this.intervalId !== null) {
      this.baseNode.removeEventListener('click', this.handleClick);
      window.clearInterval(this.intervalId);
    }
  }

  private update(): void {
    const date: Date = new Date();
    const options = { locale: this.localeObject };
    this.timeSection.innerText = format(date, this.format.time, options);
    this.dateSection.innerText = format(date, this.format.date, options);
  }

  getFormat(): DateTimeFormat {
    return { ...this.format };
  }
  setFormat(format: Partial<DateTimeFormat>): void {
    this.format = {
      ...this.format,
      ...format,
    };
    this.update();
  }

  getLocale(): string {
    return toBcp47Locale(this.localeKey) || this.localeKey;
  }
  setLocale(value: string): void {
    let localeKey: LocaleKey;
    try {
      localeKey = toDateFnsLocaleKey(value);
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
      `../../locale/modules/${localeKey}`
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

  private handleClick(): void {
    const modal: ClockSettingsModal = new ClockSettingsModal(this);
    modal.draw(document.querySelector('.modal-wrapper'));
  }
}

export default Clock;
