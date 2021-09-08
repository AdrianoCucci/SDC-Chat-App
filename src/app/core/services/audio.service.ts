import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private readonly _assetsPrefix: string = "assets/audio";

  private readonly _audioSourceMap = new Map<AudioSound, string>([
    [AudioSound.ChatNotification, `${this._assetsPrefix}/sdc_chat_notification.wav`]
  ]);

  private readonly _audio = new Audio();

  public async play(sound: AudioSound, volume: number = 1): Promise<void> {
    if(this._audioSourceMap.has(sound)) {
      this._audio.src = this._audioSourceMap.get(sound);
      this._audio.volume = this.clampVolume(volume);

      this._audio.load();
      await this._audio.play();
    }

    return Promise.resolve();
  }

  private clampVolume(volume: number): number {
    return Math.min(Math.max(volume, 0), 1);
  }
}

export enum AudioSound {
  ChatNotification
}