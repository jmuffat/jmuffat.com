export class TestWorker {
  constructor() {
    this.worker = new Worker('./worker.js', { type: 'module' });

    this.worker.onmessage = event => {
      console.log('worker result = ' + JSON.stringify(event.data));
    }

    this.worker.postMessage(42);
  }
}
