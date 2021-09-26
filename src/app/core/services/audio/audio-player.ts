export class AudioPlayer {
  public maxInstances: number = 10;

  private readonly _audioInstances: HTMLAudioElement[] = [];

  public play(source: string, loop: boolean = false): void {
    const audio: HTMLAudioElement = this.createAudioInstance();

    if(audio != null) {
      audio.src = source;
      audio.volume = 1;
      audio.loop = loop;

      audio.play();
      audio.onended = () => this.onAudioEnd(audio);
    }
  }

  public stop(source: string): void {
    const audio: HTMLAudioElement = this._audioInstances.find((a: HTMLAudioElement) => a.src.endsWith(source));

    if(audio !== null) {
      this.removeAudioInstance(audio);
    }
  }

  public stopAll(): void {
    for(let i = 0; i < this._audioInstances.length; i++) {
      this._audioInstances[i].pause();
    }

    this._audioInstances.splice(0, this._audioInstances.length);
  }

  private createAudioInstance(): HTMLAudioElement {
    let audio: HTMLAudioElement = null;

    if(this._audioInstances.length < this.maxInstances) {
      audio = new Audio();
      this._audioInstances.push(audio);
    }

    return audio;
  }

  private removeAudioInstance(audio: HTMLAudioElement): void {
    const index: number = this._audioInstances.indexOf(audio);

    if(index !== -1) {
      audio.pause();
      this._audioInstances.splice(index, 1);
    }
  }

  private onAudioEnd(audio: HTMLAudioElement): void {
    if(!audio.loop) {
      this.removeAudioInstance(audio);
    }
  }
}