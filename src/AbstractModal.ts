import AbstractComponent from './AbstractComponent';

abstract class AbstractModal extends AbstractComponent {
  protected wrapperNode: HTMLElement | null;

  constructor() {
    super();

    this.wrapperNode = null;
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  draw(wrapperNode: HTMLElement | null): void {
    if (!this.wrapperNode && wrapperNode) {
      this.wrapperNode = wrapperNode;
      this.wrapperNode.addEventListener('click', this.handleClickOutside);

      const baseNode: HTMLElement | null = wrapperNode.querySelector('.modal');
      super.draw(baseNode);

      this.wrapperNode.classList.remove('hidden');
    }
  }

  erase(): void {
    if (this.wrapperNode && this.baseNode) {
      this.wrapperNode.classList.add('hidden');

      super.erase();

      this.wrapperNode = null;
    }
  }

  applyAndErase(): void {
    this.apply();
    this.erase();
  }

  protected abstract apply(): void;

  protected handleClickOutside(event: MouseEvent): void {
    if (event.target === this.wrapperNode) {
      this.erase();
    }
  }
};

export default AbstractModal;
