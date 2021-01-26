import dayjs, { Dayjs } from 'dayjs';

let initialized: boolean = false;
const elements: {
  timeSection: HTMLElement,
  dateSection: HTMLElement,
} = {
  timeSection: document.querySelector('.clock-time') as HTMLElement,
  dateSection: document.querySelector('.clock-date') as HTMLElement,
};

function initialize(): boolean {
  if (initialized) {
    return false;
  }

  window.setInterval(update, 1000);

  initialized = true;
  return true;
}

function update(): void {
  const date: Dayjs = dayjs(new Date());
  elements.timeSection.innerText = dayjs(date).format('hh:mm:ss');
  elements.dateSection.innerText = dayjs(date).format('YYYY-MM-DD');
}

export default {
  initialize,
};
