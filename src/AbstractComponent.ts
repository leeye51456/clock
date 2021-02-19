abstract class AbstractComponent {
  protected baseNode: HTMLElement | null;

  constructor() {
    this.baseNode = null;
  }

  draw(baseNode: HTMLElement | null): void {
    if (!this.baseNode && baseNode) {
      this.baseNode = baseNode;
      for (let i = this.baseNode.children.length - 1; i >= 0; i -= 1) {
        this.baseNode.children[i].remove();
      }
      this.drawChildren();
    }
  }

  protected abstract drawChildren(): void;

  erase(): void {
    if (this.baseNode) {
      this.release();

      for (let index = this.baseNode.children.length - 1; index >= 0; index -= 1) {
        this.baseNode.children[index].remove();
      }
      this.baseNode = null;
    }
  }

  protected abstract release(): void;
};

export default AbstractComponent;
