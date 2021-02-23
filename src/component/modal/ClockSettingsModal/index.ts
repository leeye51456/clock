import AbstractModal from '../AbstractModal';
import Clock, { DateTimeFormat } from '../../Clock';

function createListItem(title: string, form: HTMLElement): HTMLLIElement {
  const span: HTMLSpanElement = document.createElement('span');
  span.textContent = title;

  const label: HTMLLabelElement = document.createElement('label');
  label.append(span, form);

  const li: HTMLLIElement = document.createElement('li');
  li.appendChild(label);

  return li;
}

function createButton(label: string, onclick: (event?: MouseEvent) => void): HTMLButtonElement {
  const button: HTMLButtonElement = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', onclick);

  return button;
}

class ClockSettingsModal extends AbstractModal {
  private dateFormatTextInput: HTMLInputElement = document.createElement('input');
  private timeFormatTextInput: HTMLInputElement = document.createElement('input');
  private localeTextInput: HTMLInputElement = document.createElement('input');

  constructor(private clock: Clock) {
    super();

    this.applyAndErase = this.applyAndErase.bind(this);
    this.erase = this.erase.bind(this);

    const { date, time }: DateTimeFormat = clock.getFormat();
    this.dateFormatTextInput.value = date;
    this.timeFormatTextInput.value = time;
    this.localeTextInput.value = clock.getLocale();
    this.localeTextInput.setAttribute('list', 'locales');
  }

  protected drawChildren(): void {
    if (this.baseNode) {
      const ul: HTMLUListElement = document.createElement('ul');
      ul.append(
        createListItem('Date Format', this.dateFormatTextInput),
        createListItem('Time Format', this.timeFormatTextInput),
        createListItem('Language', this.localeTextInput),
      )

      const div: HTMLDivElement = document.createElement('div');
      div.classList.add('action');
      div.append(
        createButton('Cancel', this.erase),
        createButton('Apply', this.applyAndErase),
      );

      this.baseNode.append(ul, div);
    }
  }

  protected release(): void {
  }

  protected apply(): void {
    if (this.baseNode) {
      this.clock.setFormat({
        date: this.dateFormatTextInput.value,
        time: this.timeFormatTextInput.value,
      });
      this.clock.setLocale(this.localeTextInput.value);
    }
  }
}

export default ClockSettingsModal;
