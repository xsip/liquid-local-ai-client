import { animate, style, transition, trigger } from '@angular/animations';
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArchiveBox,
  heroArrowDownTray,
  heroDocument,
  heroFilm,
  heroMusicalNote,
  heroPaperClip,
  heroPhoto,
  heroTableCells,
} from '@ng-icons/heroicons/outline';
import {
  AuthImageComponent,
  AuthImageMountDirective,
  CodeBlockMountDirective,
  FileCardMountDirective,
} from '../../routes/lm-studio-api/markdown.pipe';
import { ChatMetadataDto } from '../../client';

interface FileTypeConfig {
  icon: string;
  iconClass: string; // tailwind text-* colour class
  extClass: string; // tailwind text-* colour class for the badge
}

const FILE_TYPE_MAP: Record<string, FileTypeConfig> = {
  pdf: { icon: 'heroDocument', iconClass: 'text-error-text', extClass: 'text-error-text' },
  doc: { icon: 'heroDocument', iconClass: 'text-accent-text', extClass: 'text-accent-text' },
  docx: { icon: 'heroDocument', iconClass: 'text-accent-text', extClass: 'text-accent-text' },
  xls: { icon: 'heroTableCells', iconClass: 'text-success-text', extClass: 'text-success-text' },
  xlsx: { icon: 'heroTableCells', iconClass: 'text-success-text', extClass: 'text-success-text' },
  csv: { icon: 'heroTableCells', iconClass: 'text-success-text', extClass: 'text-success-text' },
  zip: {
    icon: 'heroArchiveBox',
    iconClass: 'text-tertiary-accent-text',
    extClass: 'text-tertiary-accent-text',
  },
  tar: {
    icon: 'heroArchiveBox',
    iconClass: 'text-tertiary-accent-text',
    extClass: 'text-tertiary-accent-text',
  },
  gz: {
    icon: 'heroArchiveBox',
    iconClass: 'text-tertiary-accent-text',
    extClass: 'text-tertiary-accent-text',
  },
  mp4: {
    icon: 'heroFilm',
    iconClass: 'text-secondary-accent-text',
    extClass: 'text-secondary-accent-text',
  },
  mov: {
    icon: 'heroFilm',
    iconClass: 'text-secondary-accent-text',
    extClass: 'text-secondary-accent-text',
  },
  mp3: {
    icon: 'heroMusicalNote',
    iconClass: 'text-secondary-accent-text',
    extClass: 'text-secondary-accent-text',
  },
  wav: {
    icon: 'heroMusicalNote',
    iconClass: 'text-secondary-accent-text',
    extClass: 'text-secondary-accent-text',
  },
  png: {
    icon: 'heroPhoto',
    iconClass: 'text-secondary-accent-text',
    extClass: 'text-secondary-accent-text',
  },
  jpg: {
    icon: 'heroPhoto',
    iconClass: 'text-secondary-accent-text',
    extClass: 'text-secondary-accent-text',
  },
  jpeg: {
    icon: 'heroPhoto',
    iconClass: 'text-secondary-accent-text',
    extClass: 'text-secondary-accent-text',
  },
  gif: {
    icon: 'heroPhoto',
    iconClass: 'text-secondary-accent-text',
    extClass: 'text-secondary-accent-text',
  },
  svg: {
    icon: 'heroPhoto',
    iconClass: 'text-secondary-accent-text',
    extClass: 'text-secondary-accent-text',
  },
};

const FILE_TYPE_FALLBACK: FileTypeConfig = {
  icon: 'heroDocument',
  iconClass: 'text-text-muted',
  extClass: 'text-text-muted',
};

@Component({
  selector: 'app-chat-attachments-sidebar',
  animations: [
    trigger('chatItemAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-12px)' }),
        animate(
          '220ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'translateX(0)' }),
        ),
      ]),
    ]),
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgIconComponent,
    AuthImageMountDirective,
    CodeBlockMountDirective,
    FileCardMountDirective,
    AuthImageComponent,
  ],
  viewProviders: [
    provideIcons({
      heroPaperClip,
      heroDocument,
      heroTableCells,
      heroArchiveBox,
      heroFilm,
      heroMusicalNote,
      heroPhoto,
      heroArrowDownTray,
    }),
  ],
  template: `
    <div
      class="flex-1 overflow-y-auto py-1 min-h-0 px-2 flex flex-col gap-0.5"
      mountAuthImages
      mountCodeBlocks
      mountFileCards
    >
      @if (chat()?.generatedAssets?.length === 0) {
        <div class="flex flex-col items-center justify-center h-full gap-2 text-center px-3 py-8">
          <ng-icon name="heroPaperClip" class="w-8 h-8 text-text-disabled animate-float" />
          <span class="text-[10px] text-text-disabled uppercase tracking-wider">{{
            'sidebar.noGeneratedFiles' | translate
          }}</span>
        </div>
      } @else {
        @for (asset of chat()!.generatedAssets!; track asset._id) {
          @if (asset.type === 'FILE') {
            <!-- ── File card ── -->
            <div
              class="group flex items-center gap-3 rounded-xl px-3 py-2.5 border border-border-default bg-surface-raised shadow-sm cursor-pointer hover-lift transition-all duration-200"
              [attr.data-auth-href]="asset.url"
              [attr.data-auth-filename]="asset.filename"
              @chatItemAnim
            >
              <!-- File type icon -->
              <div
                class="flex-shrink-0 w-9 h-9 rounded-lg bg-surface-overlay flex items-center justify-center"
                [class]="fileTypeConfig(asset.filename).iconClass"
              >
                <ng-icon [name]="fileTypeConfig(asset.filename).icon" class="w-[18px] h-[18px]" />
              </div>

              <!-- Filename + ext badge -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span
                    class="text-[13px] font-medium text-text-primary truncate max-w-[160px]"
                    [title]="asset.filename ?? ''"
                    >{{ asset.filename }}</span
                  >
                  <span
                    class="text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-overlay"
                    [class]="fileTypeConfig(asset.filename).extClass"
                  >
                    {{ fileExt(asset.filename) }}
                  </span>
                </div>
                <p class="text-[11px] mt-0.5 text-text-muted truncate">{{ asset.url }}</p>
              </div>

              <!-- Download button -->
              <button
                type="button"
                data-auth-download
                (click)="$event.stopPropagation()"
                [title]="'Download ' + asset.filename"
                class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border border-accent-text bg-accent-subtle text-accent-text opacity-0 group-hover:opacity-100 transition-all duration-150 hover:scale-105 active:scale-95"
              >
                <ng-icon name="heroArrowDownTray" class="w-4 h-4" />
              </button>
            </div>
          } @else if (asset.type === 'IMAGE' && asset.thumbnail) {
            <button
              type="button"
              class="w-full flex flex-col gap-2 text-left px-2.5 py-2 text-xs rounded-xl group relative active:scale-[0.98] transition-all duration-200 text-text-secondary bg-surface-overlay/40 hover:bg-surface-overlay hover:text-text-primary"
              @chatItemAnim
            >
              <div class="relative">
                <app-auth-image [authSrc]="asset.thumbnail" />
                <div
                  class="flex absolute bottom-0 left-0 w-full bg-surface-overlay/80 items-center gap-1.5 pl-1"
                >
                  <div class="truncate font-medium leading-tight">{{ asset.filename }}</div>
                </div>
              </div>
            </button>
          }
        }
      }
    </div>
  `,
})
export class ChatAttachmentsSidebarComponent {
  readonly chat = input.required<ChatMetadataDto | null>();

  fileExt(filename?: string | null): string {
    return filename?.split('.').pop()?.toLowerCase() ?? 'file';
  }

  fileTypeConfig(filename?: string | null): FileTypeConfig {
    return FILE_TYPE_MAP[this.fileExt(filename)] ?? FILE_TYPE_FALLBACK;
  }
}
