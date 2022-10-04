import { Modal, ButtonComponent, App } from 'obsidian';

const OPEN_BROWSER_IN_SECONDS = 4;

export default class TistoryAuthModal extends Modal {
  private secondsLeft = OPEN_BROWSER_IN_SECONDS;
  private opened = false;

  private timerDiv: HTMLDivElement;

  private intervalId: NodeJS.Timeout | null = null;
  isSuccess: boolean;

  constructor(app: App, private readonly authLink: string, private readonly afterClose: () => void) {
    super(app);
  }

  get isOpen(): boolean {
    return this.opened;
  }

  onOpen(): void {
    this.opened = true;

    this.timerDiv = this.modalEl.createDiv();
    this.updateText();

    this.intervalId = setInterval(() => {
      this.secondsLeft -= 1;
      this.updateText();

      if (this.secondsLeft === 0) {
        window.open(this.authLink);
        this.clearInterval();
      }
    }, 1_000);
    this.addNoWaitDiv(this.intervalId);

    new ButtonComponent(this.modalEl.createDiv())
      .setButtonText('취소')
      .setCta()
      .onClick(() => this.close());
  }

  clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async onClose(): Promise<void> {
    this.clearInterval();
    this.opened = false;
    this.afterClose();
  }

  private addNoWaitDiv(interval: NodeJS.Timeout) {
    const linkEl = createEl('a', { href: this.authLink, text: '여기' });
    linkEl.onclick = () => {
      this.clearInterval();
      this.secondsLeft = 0;
      // `Please complete authentication at tistory.com; Opening browser in ${this.secondsLeft} seconds...`
      this.updateText();
    };

    const noWaitDiv = this.modalEl.createDiv();
    // noWaitDiv.appendText("If you do not want to wait, click ");
    noWaitDiv.appendText('기다리지 않으려면 ');
    noWaitDiv.append(linkEl);
    noWaitDiv.appendText('를 클릭하세요.');
    return noWaitDiv;
  }

  public updateText(text?: string) {
    this.timerDiv.setText(text ?? `티스토리에서 인증을 완료해주세요. ${this.secondsLeft}초 후에 브라우저 열기...`);
  }
}
