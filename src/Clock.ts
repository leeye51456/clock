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
  const date: Date = new Date();
  elements.timeSection.innerText = twoDigits`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  elements.dateSection.innerText = twoDigits`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function twoDigits(strings: TemplateStringsArray, ...args: any[]): string {
  let result = '';
  const argCount = args.length;
  for (let i = 0; i < argCount; i += 1) {
    result += `${strings[i]}${typeof args[i] === 'number' ? fillLeadingZeros(args[i], 2) : args[i]}`;
  }
  return `${result}${strings[argCount]}`;
}

function fillLeadingZeros(value: number, displayLength: number): string {
  const stringValue: string = value.toString();
  const numberLength: number = stringValue.length;
  if (numberLength >= displayLength) {
    return stringValue;
  }
  return `${new Array(displayLength - numberLength).fill('0').join('')}${stringValue}`;
}

export default {
  initialize,
};
