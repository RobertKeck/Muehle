function startWorker(): void {
    const self = this;
    // tslint:disable-next-line: only-arrow-functions
    self.onmessage = function(e): void {
        console.log('Received input: ', e.data); // message received from main thread
        self.postMessage('Response back to main thread');
    };
}
