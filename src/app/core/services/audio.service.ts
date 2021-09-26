import { Injectable } from "@angular/core";
import { AudioSound } from "src/app/shared/models/audio-sound";

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private readonly _assetsPrefix: string = "assets/audio";

  private readonly _audioSourceMap = new Map<AudioSound, () => HTMLAudioElement>([
    [AudioSound.ChatNotification, () => new Audio(`${this._assetsPrefix}/chat_notification.wav`)]
  ]);

  public play(sound: AudioSound, volume: number = 1): void {
    if(this._audioSourceMap.has(sound)) {
      const audio: HTMLAudioElement = this._audioSourceMap.get(sound)();

      audio.volume = this.clampVolume(volume);
      audio.play();
    }
  }

  private clampVolume(volume: number): number {
    return Math.min(Math.max(volume, 0), 1);
  }
}