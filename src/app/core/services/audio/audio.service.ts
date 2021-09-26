import { Injectable } from "@angular/core";
import { AudioSound } from "src/app/shared/models/audio-sound";
import { Pair } from "src/app/shared/models/pair";
import { AudioPlayer } from "./audio-player";

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private readonly _assetsPrefix: string = "assets/audio";

  private readonly _audioPlayerMap = new Map<AudioSound, Pair<string, AudioPlayer>>([
    [AudioSound.ChatNotification, { key: "chat_notification.wav", value: null }],
    [AudioSound.RoomPing, { key: "room_ping.wav", value: null }],
  ]);

  public play(sound: AudioSound, loop: boolean = false): void {
    const sourcePlayerPair: Pair<string, AudioPlayer> = this.getSourcePlayerPair(sound);

    if(sourcePlayerPair != null) {
      const audioSource: string = `${this._assetsPrefix}/${sourcePlayerPair.key}`;
      const player: AudioPlayer = sourcePlayerPair.value;

      player.play(audioSource, loop);
    }
  }

  public stop(sound: AudioSound): void {
    const sourcePlayerPair: Pair<string, AudioPlayer> = this.getSourcePlayerPair(sound);

    if(sourcePlayerPair != null) {
      const audioSource: string = `${this._assetsPrefix}/${sourcePlayerPair.key}`;
      const player: AudioPlayer = sourcePlayerPair.value;

      player.stop(audioSource);
    }
  }

  private getSourcePlayerPair(sound: AudioSound): Pair<string, AudioPlayer> {
    let pair: Pair<string, AudioPlayer> = null;

    if(this._audioPlayerMap.has(sound)) {
      pair = this._audioPlayerMap.get(sound);

      if(pair.value == null) {
        pair.value = new AudioPlayer();
      }
    }

    return pair;
  }
}