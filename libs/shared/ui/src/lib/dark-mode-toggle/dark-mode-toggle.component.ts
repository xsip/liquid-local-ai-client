import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { readStoredTheme, applyTheme } from '../utils/theme.utils';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroSun, heroMoon } from '@ng-icons/heroicons/outline';

/**
 * Self-contained dark-mode toggle button.
 * Reads the stored preference on init and applies it immediately.
 *
 * Usage:
 *   <ui-dark-mode-toggle />
 */
@Component({
  selector: 'ui-dark-mode-toggle',
  standalone: true,
  imports: [TranslateModule, NgIconComponent],
  viewProviders: [provideIcons({ heroSun, heroMoon })],
  template: `
    <button
      type="button"
      (click)="toggle()"
      class="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-border-default text-text-secondary hover:border-accent/50 hover:text-accent hover:bg-accent-subtle active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 overflow-hidden"
      [title]="(isDark() ? 'darkMode.switchToLight' : 'darkMode.switchToDark') | translate"
      style="transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);"
    >
      @if (isDark()) {
        <!-- sun -->
        <ng-icon name="heroSun" class="w-3.5 h-3.5 animate-scale-in" />
      } @else {
        <!-- moon -->
        <ng-icon name="heroMoon" class="w-3.5 h-3.5 animate-scale-in" />
      }
    </button>
  `,
})
export class DarkModeToggleComponent implements OnInit {
  readonly isDark = signal(readStoredTheme());

  ngOnInit(): void {
    applyTheme(this.isDark());
  }

  toggle(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    applyTheme(next);
  }
}
