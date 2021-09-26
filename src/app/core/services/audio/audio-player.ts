export class AudioPlayer {
  public readonly source: string;

  public maxInstances: number = 1;
  public loop: boolean = false;

  private readonly _audioInstances: HTMLAudioElement[] = [];
  private _volume: number;

  public constructor(source: string) {
    this.source = source;
  }

  public play(): void {
    const audio: HTMLAudioElement = this.createAudioInstance();

    if(audio) {
      audio.src = this.source;
      audio.volume = this.volume;

      audio.play();
      audio.onended = () => this.onAudioEnd(audio);
    }
  }

  public stop(): void {
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

  private onAudioEnd(audio: HTMLAudioElement): void {
    if(!this.loop) {
      const index: number = this._audioInstances.indexOf(audio);

      if(index !== -1) {
        this._audioInstances.splice(index, 1);
      }
    }
  }

  public get volume(): number {
    return this._volume;
  }

  public set volume(value: number) {
    if(typeof value !== "number") {
      value = 1;
    }
    else if(value < 0) {
      value = 0;
    }
    else if(value > 1) {
      value = 1;
    }

    this._volume = value;
  }
}