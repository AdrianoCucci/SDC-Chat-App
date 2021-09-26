import { AudioSound } from "src/app/shared/models/audio-sound";

export class AudioPlayer {
  public maxDistinctInstances: number;
  public maxSameInstances: number;

  private readonly _audioInstanceMap = new Map<AudioSound, HTMLAudioElement[]>();
  private _oneShotAudio: HTMLAudioElement;
  private _oneShotReady: boolean = true;

  public constructor(maxDistinctInstances?: number, maxSameInstances?: number) {
    this.maxDistinctInstances = maxDistinctInstances != null ? maxDistinctInstances : 20;
    this.maxSameInstances = maxSameInstances != null ? maxSameInstances : 5;
  }

  public play(sound: AudioSound, source: string, loop: boolean = false): void {
    const audio: HTMLAudioElement = this.createAudioInstance(sound);

    if(audio != null) {
      audio.src = source;
      audio.loop = loop;

      audio.play();
      audio.onended = () => this.onAudioEnd(audio, sound);
    }
  }

  public async playOneShot(source: string): Promise<void> {
    if(this._oneShotReady) {
      if(this._oneShotAudio == null) {
        this._oneShotAudio = new Audio(source);
      }
      else {
        this._oneShotAudio.pause();
        this._oneShotAudio.src = source;
      }

      this._oneShotReady = false;
      await this._oneShotAudio.play().finally(() => this._oneShotReady = true);

      this._oneShotAudio.onended = () => this._oneShotAudio = null;
    }
  }

  public stop(sound: AudioSound): void {
    this.removeAudio(sound);
  }

  public stopAllOfType(sound: AudioSound): void {
    this.removeAllAudioOfType(sound);
  }

  public stopAllAudio(): void {
    this.clearAllAudio();
  }

  private createAudioInstance(sound: AudioSound): HTMLAudioElement {
    let newInstance: HTMLAudioElement = null;
    let instances: HTMLAudioElement[] = this._audioInstanceMap.get(sound);

    if(instances == null && this._audioInstanceMap.size < this.maxDistinctInstances) {
      newInstance = new Audio();
      instances = [newInstance];

      this._audioInstanceMap.set(sound, instances);
    }
    else if(instances.length < this.maxSameInstances) {
      newInstance = new Audio();
      instances.push(newInstance);
    }

    return newInstance;
  }

  private removeAudio(sound: AudioSound): void {
    const instances: HTMLAudioElement[] = this._audioInstanceMap.get(sound);

    if(instances?.length > 0) {
      const oldestInstance: HTMLAudioElement = instances[0];
      oldestInstance.pause();

      instances.splice(0, 1);

      if(instances.length === 0) {
        this._audioInstanceMap.delete(sound);
      }
    }
  }

  private removeAllAudioOfType(sound: AudioSound): void {
    const instances: HTMLAudioElement[] = this._audioInstanceMap.get(sound);

    if(instances != null) {
      for(let i = 0; i < instances.length; i++) {
        instances[i].pause();
      }

      this._audioInstanceMap.delete(sound);
    }
  }

  private clearAllAudio(): void {
    this._audioInstanceMap.forEach((instances: HTMLAudioElement[]) => {
      for(let i = 0; i < instances.length; i++) {
        instances[i].pause();
      }
    });

    this._audioInstanceMap.clear();
  }

  private onAudioEnd(audio: HTMLAudioElement, sound: AudioSound): void {
    if(!audio.loop) {
      this.removeAudio(sound);
    }
  }
}