import { Component, ElementRef, input, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPause, heroPlay } from '@ng-icons/heroicons/outline';

/**
 * Minimal custom audio player — play/pause button, seekable progress bar,
 * elapsed/total time — styled to match the chat bubble design instead of
 * relying on the browser's native <audio controls> chrome.
 */
@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [provideIcons({ heroPlay, heroPause })],
  template: `
    <div class="flex items-center gap-2.5 min-w-[220px]">
      <button
        type="button"
        (click)="toggle()"
        class="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-accent text-white active:scale-90 transition-transform"
        style="box-shadow: 0 2px 8px var(--color-accent-glow);"
      >
        @if (playing()) {
          <ng-icon name="heroPause" class="w-3.5 h-3.5" />
        } @else {
          <ng-icon name="heroPlay" class="w-3.5 h-3.5 ml-0.5" />
        }
      </button>

      <div class="flex-1 min-w-0 flex flex-col gap-1">
        <div
          class="relative h-1.5 rounded-full bg-surface-sunken cursor-pointer overflow-hidden"
          (click)="seek($event)"
        >
          <div
            class="absolute inset-y-0 left-0 rounded-full bg-accent transition-all duration-100"
            [style.width.%]="progressPct()"
          ></div>
        </div>
        <span class="text-[10px] text-text-muted font-mono tabular-nums">
          {{ formatTime(currentTime()) }} / {{ formatTime(duration()) }}
        </span>
      </div>
    </div>

    <audio
      #audioEl
      [src]="src()"
      (loadedmetadata)="onLoadedMetadata()"
      (timeupdate)="onTimeUpdate()"
      (ended)="playing.set(false)"
      class="hidden"
    ></audio>
  `,
})
export class AudioPlayerComponent {
  @ViewChild('audioEl') private audioRef!: ElementRef<HTMLAudioElement>;

  readonly src = input.required<string>();

  readonly playing = signal(false);
  readonly currentTime = signal(0);
  readonly duration = signal(0);

  readonly progressPct = () => {
    const d = this.duration();
    return d > 0 ? (this.currentTime() / d) * 100 : 0;
  };

  toggle(): void {
    const el = this.audioRef?.nativeElement;
    if (!el) return;
    if (el.paused) {
      el.play();
      this.playing.set(true);
    } else {
      el.pause();
      this.playing.set(false);
    }
  }

  seek(event: MouseEvent): void {
    const el = this.audioRef?.nativeElement;
    if (!el || !this.duration()) return;
    const bar = event.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    el.currentTime = pct * this.duration();
    this.currentTime.set(el.currentTime);
  }

  onLoadedMetadata(): void {
    this.duration.set(this.audioRef.nativeElement.duration || 0);
  }

  onTimeUpdate(): void {
    this.currentTime.set(this.audioRef.nativeElement.currentTime);
  }

  formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
