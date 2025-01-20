export class Semaphore {
  private tasks: Array<() => void> = [];
  private permits: number;

  constructor(permits = 1) {
    this.permits = permits;
  }

  acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits -= 1;
      return Promise.resolve();
    }
    return new Promise((resolve) => this.tasks.push(resolve));
  }

  release(): void {
    if (this.tasks.length > 0) {
      const next = this.tasks.shift();
      next!();
      return;
    }
    this.permits += 1;
  }
}
