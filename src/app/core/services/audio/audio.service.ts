import { Injectable } from "@angular/core";
import { AudioSound } from "src/app/shared/models/audio-sound";
import { AudioPlayer } from "./audio-player";

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private readonly _player = new AudioPlayer();
  private readonly _assetsPrefix: string = "assets/audio";
  private readonly _soundSourceMap = new Map<AudioSound, string>([
    [AudioSound.ChatNotification, "chat_notification.wav"],
    [AudioSound.RoomPing, "room_ping.wav"]
  ]);

  public play(sound: AudioSound, loop: boolean = false): void {
    const sourceFile: string = this._soundSourceMap.get(sound);

    if(sourceFile != null) {
      const sourcePath: string = `${this._assetsPrefix}/${sourceFile}`;
      this._player.play(sound, sourcePath, loop);
    }
  }

  public async playOneShot(sound: AudioSound): Promise<void> {
    const sourceFile: string = this._soundSourceMap.get(sound);

    if(sourceFile != null) {
      const sourcePath: string = `${this._assetsPrefix}/${sourceFile}`;
      await this._player.playOneShot(sourcePath);
    }
  }

  public stop(sound: AudioSound): void {
    this._player.stop(sound);
  }

  public stopAllOfType(sound: AudioSound): void {
    this._player.stopAllOfType(sound);
  }

  public stopAllAudio(): void {
    this._player.stopAllAudio();
  }
}