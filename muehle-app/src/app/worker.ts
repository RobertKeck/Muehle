export class MyWorker implements Worker{

  onerror: (this: AbstractWorker, ev: ErrorEvent) => any;
  onmessageerror: (this: Worker, ev: MessageEvent) => any;
  onmessage: (this: Worker, ev: MessageEvent) => any;
  postMessage(message: any, transfer: Transferable[]): void;
  postMessage(message: any, options?: PostMessageOptions): void;

  postMessage(message: any, options?: any): void {
    while (1 === 1){

    }
    // console.log(message);
  }
  terminate(): void {
    console.log('Worker terminated');
    self.close();
  }

  addEventListener<K extends 'message' | 'messageerror' | 'error'>(type: K, listener: (this: Worker, ev: WorkerEventMap[K]) => any,
                                                                   options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  addEventListener(type: any, listener: any, options?: any): void{
      const data = listener.data;
      switch (data.cmd) {
        case 'start':
          self.postMessage('WORKER STARTED: ' + data.msg, '');
          break;
        case 'stop':
          self.postMessage('WORKER STOPPED: ' + data.msg +
                           '. (buttons will no longer work)', '');
          self.close(); // Terminates the worker.
          break;
        default:
          self.postMessage('Unknown command: ' + data.msg, '');
      }
  }

  removeEventListener<K extends 'message' | 'messageerror' | 'error'>(type: K, listener: (this: Worker, ev: WorkerEventMap[K]) => any,
                                                                      options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

  removeEventListener(type: any, listener: any, options?: any): void {
    throw new Error('Method not implemented.');
  }
  dispatchEvent(event: Event): boolean {
    throw new Error('Method not implemented.');
  }



  doNothing(): void {
    // do nothing
  }
}

