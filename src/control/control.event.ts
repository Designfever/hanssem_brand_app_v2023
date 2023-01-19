interface IControlEventDictionary {
  [index: string]: Array<IControlEvent>;
}

interface IControlEvent {
  node: HTMLElement;
  handler: (e: Event) => void;
  capture: boolean;
}

class ControlEvent {
  private events: IControlEventDictionary;

  constructor() {
    this.events = {};
  }

  public addHandler(
    node: HTMLElement,
    event: string,
    handler: (e: Event) => void,
    capture = false
  ): void {
    if (!(event in this.events)) {
      this.events[event] = [];
    }

    this.events[event].push({
      node: node,
      handler: handler,
      capture: capture
    });
    node.addEventListener(event, handler, capture);
  }

  public removeHandler(targetNode: HTMLElement, event: string): void {
    this.events[event]
      .filter(({ node }) => node === targetNode)
      .forEach(({ node, handler, capture }) => {
        node.removeEventListener(event, handler, capture);
      });
    this.events[event] = this.events[event].filter(
      ({ node }) => node !== targetNode
    );
  }

  public removeAllHandler(): void {
    Object.entries(this.events).forEach((eventHandler) => {
      const eventName = eventHandler[0];
      eventHandler[1].forEach((controlEvent) => {
        controlEvent.node.removeEventListener(
          eventName,
          controlEvent.handler,
          controlEvent.capture
        );
      });
    });
    this.events = {};
  }

  public setDestroy(): void {
    this.removeAllHandler();
  }
}
export default ControlEvent;
