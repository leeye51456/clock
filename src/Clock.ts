import dayjs, { Dayjs } from 'dayjs';
import AbstractComponent from './AbstractComponent';

class Clock extends AbstractComponent {
  private intervalId: number | null = null;
  private timeSection: HTMLElement = document.createElement('section');
  private dateSection: HTMLElement = document.createElement('section');

  constructor() {
    super();

    this.timeSection.classList.add('clock-time');
    this.dateSection.classList.add('clock-date');
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
    const date: Dayjs = dayjs(new Date());
    this.timeSection.innerText = dayjs(date).format('hh:mm:ss');
    this.dateSection.innerText = dayjs(date).format('YYYY-MM-DD');
  }
}

export default Clock;
