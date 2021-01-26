abstract class AbstractComponent {
  protected baseNode: ParentNode | null;

  constructor() {
    this.baseNode = null;
  }

  draw(baseNode: Element | ParentNode | null): void {
    if (!this.baseNode && baseNode) {
      this.baseNode = baseNode as ParentNode;
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
  
      for (const node of this.baseNode.children) {
        node.remove();
      }
      this.baseNode = null;
    }
  }

  protected abstract release(): void;
};

export default AbstractComponent;
