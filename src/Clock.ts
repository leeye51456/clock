import { format } from 'date-fns';
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
}

class Clock extends AbstractComponent {
  private intervalId: number | null = null;

  private timeSection: HTMLElement = document.createElement('section');
  private dateSection: HTMLElement = document.createElement('section');

  private format: DateTimeFormat = {
    date: 'y-MM-dd',
    time: 'HH:mm:ss',
  };

  constructor(options?: ClockOptions) {
    super();

    this.timeSection.classList.add('clock-time');
    this.dateSection.classList.add('clock-date');

    this.format = {
      ...this.format,
      ...options?.format,
    };

    this.update();
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
    this.timeSection.innerText = format(date, this.format.time);
    this.dateSection.innerText = format(date, this.format.date);
  }
}

export default Clock;
