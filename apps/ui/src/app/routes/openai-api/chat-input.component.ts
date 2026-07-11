import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import Prism from 'prismjs';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChatMetadataService, ReasoningEffort } from '../../client';
import {
  ModelReasoningCapability,
  ReasoningDropdownComponent,
} from '../../shared/components/reasoning-dropdown.component';
import { SendButtonComponent } from '../../shared/components/send-button.component';
import { ResetButtonComponent } from '../../shared/components/reset-button.component';
import {
  AppendedFile,
  fileSizeLabel,
  mergeFiles,
  readFilesAsDataUrls,
} from '../../shared/utils/file.utils';
import { AudioRecorder } from '../../shared/utils/audio-recorder.utils';
import { TranslateModule } from '@ngx-translate/core';
import { MarkdownPipe } from '../../shared/components/markdown.pipe';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroDocument,
  heroEye,
  heroLink,
  heroLockClosed,
  heroMicrophone,
  heroPencilSquare,
  heroStop,
  heroXMark,
} from '@ng-icons/heroicons/outline';
import { ChatCompletionsService } from './chat-completions.service';
import { Observable, of, Subscription, switchMap, take } from 'rxjs';

// Re-export AppendedFile so existing consumers importing from this file keep working.
export type { AppendedFile };

@Component({
  selector: 'app-openai-chat-input',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    SendButtonComponent,
    ResetButtonComponent,
    ReasoningDropdownComponent,
    MarkdownPipe,
    NgIconComponent,
  ],
  viewProviders: [
    provideIcons({
      heroPencilSquare,
      heroEye,
      heroLink,
      heroDocument,
      heroXMark,
      heroLockClosed,
      heroMicrophone,
      heroStop,
    }),
  ],
  styles: [
    `
      .md-editor-wrap {
        position: relative;
      }

      .md-raw-input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
        width: 1px;
        height: 1px;
        overflow: hidden;
      }

      .md-editable {
        min-height: 80px;
        max-height: 260px;
        overflow-y: auto;
        white-space: pre-wrap;
        word-break: break-word;
        caret-color: var(--color-accent);
        outline: none;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        line-height: 1.625;
        color: var(--color-text-primary);
      }

      .md-editable:empty::before {
        content: attr(data-placeholder);
        color: var(--color-text-disabled);
        pointer-events: none;
      }

      .md-preview {
        min-height: 80px;
        max-height: 260px;
        overflow-y: auto;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        line-height: 1.625;
        cursor: text;
      }

      .md-toggle {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.625rem;
        font-weight: 500;
        padding: 0.125rem 0.5rem;
        border-radius: 9999px;
        border: 1px solid transparent;
        transition: all 0.15s;
        cursor: pointer;
        user-select: none;
        line-height: 1.4;
      }
      .md-toggle:hover {
        opacity: 0.85;
      }
      .md-toggle--edit {
        color: var(--color-text-muted);
        border-color: var(--color-border-default);
      }
      .md-toggle--preview {
        color: var(--color-accent);
        border-color: var(--color-accent);
        background: color-mix(in srgb, var(--color-accent) 8%, transparent);
      }

      @keyframes mic-pulse {
        0%, 100% { box-shadow: 0 0 0 0 var(--color-error-bg); }
        50% { box-shadow: 0 0 0 6px transparent; }
      }
      .mic-recording {
        animation: mic-pulse 1.4s ease-in-out infinite;
      }
    `,
  ],
  template: `
    <div
      class="shrink-0 px-4 py-3 relative"
      style="background: var(--color-surface-raised); border-top: 1px solid var(--color-border-subtle); box-shadow: 0 -4px 20px rgba(0,0,0,0.06);"
    >
      <form [formGroup]="form()" (ngSubmit)="submitted.emit()" class="flex flex-col gap-2">
        <!-- Editor wrapper -->
        <div
          class="md-editor-wrap relative group rounded-2xl overflow-hidden"
          style="background: var(--color-surface-base); border: 1px solid var(--color-border-default); box-shadow: var(--shadow-inset);"
        >
          <!-- Glow ring on focus -->
          <div
            class="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
            [style.opacity]="focused() ? 1 : 0"
            style="box-shadow: 0 0 0 2px var(--color-accent-glow);"
          ></div>

          <!-- Hidden textarea keeps FormGroup in sync -->
          <textarea
            #rawInput
            formControlName="input"
            class="md-raw-input"
            tabindex="-1"
            aria-hidden="true"
          ></textarea>

          <!-- EDIT mode: always in DOM so content survives toggle -->
          <div
            #editableDiv
            class="md-editable"
            contenteditable="true"
            [attr.data-placeholder]="'chatInput.placeholder' | translate"
            [hidden]="previewMode()"
            (input)="onEditableInput()"
            (keydown)="onKeydown($event)"
            (focus)="focused.set(true)"
            (blur)="focused.set(false)"
          ></div>

          <!-- PREVIEW mode: always in DOM, Prism re-highlights on each show -->
          <div
            #previewDiv
            class="md-preview markdown-body"
            [hidden]="!previewMode()"
            (click)="switchToEdit()"
            [innerHTML]="rawText() | markdown"
          ></div>

          <!-- Toggle pill -->
          <button
            type="button"
            class="md-toggle absolute top-2 right-2"
            [class]="previewMode() ? 'md-toggle--preview' : 'md-toggle--edit'"
            (click)="togglePreview()"
            [title]="previewMode() ? 'Back to editing' : 'Preview markdown'"
          >
            @if (previewMode()) {
              <ng-icon name="heroPencilSquare" class="w-2.5 h-2.5" />
              Edit
            } @else {
              <ng-icon name="heroEye" class="w-2.5 h-2.5" />
              Preview
            }
          </button>
        </div>

        @if (generating()) {
          <div
            class="flex items-center gap-1.5 px-3 py-1.5 mb-2 text-xs rounded-xl border border-accent/40 text-accent bg-accent/10"
          >
            <span
              class="w-3 h-3 shrink-0 rounded-full border-2 border-accent border-t-transparent animate-spin"
            ></span>
            <span>{{ 'chatInput.generating' | translate }}</span>
          </div>
        } @else if (locked()) {
          <div
            class="flex items-center gap-1.5 px-3 py-1.5 mb-2 text-xs rounded-xl border border-warn text-warn bg-warn/10"
          >
            <ng-icon name="heroLockClosed" class="w-3.5 h-3.5 shrink-0" />
            <span>{{ 'chatInput.locked' | translate }}</span>
          </div>
        }

        <!-- Action row -->
        <div class="flex items-center gap-2 flex-wrap">
          <app-send-button
            [disabled]="(!rawText().trim() && appendedFiles().length === 0) || streaming() || locked()"
            [streaming]="streaming()"
          />

          <app-reasoning-dropdown
            [reasoning]="reasoning()"
            [modelReasoningCap]="modelReasoningCap()"
            (reasoningChanged)="reasoningChanged.emit($event)"
          />

          <button
            type="button"
            (click)="fileInput.click()"
            [disabled]="streaming() || locked()"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-xl select-none disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all duration-150"
            [class]="
              appendedFiles().length > 0
                ? 'border-accent text-accent bg-accent/10 hover:bg-accent/20'
                : 'border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary'
            "
            [title]="'chatInput.attach' | translate"
          >
            <ng-icon name="heroLink" class="w-3.5 h-3.5 shrink-0" />
            <span>
              @if (appendedFiles().length > 0) {
                {{ appendedFiles().length }} file{{ appendedFiles().length === 1 ? '' : 's' }}
              } @else {
                {{ 'chatInput.attach' | translate }}
              }
            </span>
          </button>

          <input
            #fileInput
            type="file"
            multiple
            class="hidden"
            (change)="onFilesSelected($event)"
          />

          <button
            type="button"
            (click)="toggleMic()"
            [disabled]="(streaming() || locked()) && !recording()"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-xl select-none disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all duration-150"
            [class]="
              recording()
                ? 'mic-recording border-error-border text-error-text bg-error-bg'
                : 'border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary'
            "
            [title]="(recording() ? 'chatInput.stopRecording' : 'chatInput.record') | translate"
          >
            @if (recording()) {
              <ng-icon name="heroStop" class="w-3.5 h-3.5 shrink-0" />
              <span class="font-mono tabular-nums">{{ recordingElapsedLabel() }}</span>
            } @else {
              <ng-icon name="heroMicrophone" class="w-3.5 h-3.5 shrink-0" />
              <span>{{ 'chatInput.record' | translate }}</span>
            }
          </button>

          @if (streaming()) {
            <app-reset-button (clicked)="reset.emit()" />
          }

          @if (form().get('input')?.invalid && form().get('input')?.touched) {
            <p class="text-xs text-red-400">{{ 'chatInput.promptRequired' | translate }}</p>
          }

          <span class="ml-auto text-[10px] text-text-muted hidden sm:block">{{
            'chatInput.hint' | translate
          }}</span>
        </div>

        <!-- Attached files list -->
        @if (appendedFiles().length > 0) {
          <div class="flex flex-col gap-1 pt-1">
            <div class="text-[10px] text-text-muted uppercase tracking-widest mb-0.5">
              {{ 'chatInput.attachedFiles' | translate }}
            </div>
            @for (file of appendedFiles(); track file.filename; let i = $index) {
              <div
                class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface-base border border-border-default text-xs group hover:-translate-y-0.5 hover:shadow-depth-sm animate-slide-up transition-all duration-200"
              >
                <ng-icon
                  [name]="file.type === 'input_audio' ? 'heroMicrophone' : 'heroDocument'"
                  class="w-3.5 h-3.5 shrink-0 text-text-muted"
                />
                <span class="truncate text-text-primary flex-1 max-w-xs">{{ file.filename }}</span>
                <span class="text-text-muted shrink-0 text-[10px]">{{
                  file.image_url || file.audio_url
                    ? fileSizeLabel((file.image_url ?? file.audio_url)!)
                    : file.sizeKb
                }}</span>
                <button
                  type="button"
                  (click)="removeFile(i)"
                  class="ml-1 shrink-0 flex items-center justify-center w-4 h-4 rounded text-text-muted hover:text-error-text hover:bg-error-bg active:scale-90 opacity-0 group-hover:opacity-100 transition-all duration-150"
                  [title]="'common.remove' | translate"
                >
                  <ng-icon name="heroXMark" class="w-3 h-3" />
                </button>
              </div>
            }
          </div>
        }
      </form>
    </div>
  `,
})
export class OpenAiChatInputComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild('fileInput') private fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('editableDiv') private editableDivRef?: ElementRef<HTMLDivElement>;
  @ViewChild('previewDiv') private previewDivRef?: ElementRef<HTMLDivElement>;
  @ViewChild('rawInput') private rawInputRef!: ElementRef<HTMLTextAreaElement>;

  /** Set to true when we need to re-run Prism after the next view check. */
  private _needsPrismHighlight = false;

  readonly form = input.required<FormGroup>();
  readonly streaming = input.required<boolean>();
  readonly locked = input<boolean>(false);
  readonly generating = input<boolean>(false);
  readonly reasoning = input.required<ReasoningEffort | undefined>();
  readonly modelReasoningCap = input.required<ModelReasoningCapability | null>();
  readonly newChatIdProvider = input.required<() => Observable<string>>();

  readonly chatCompletionsService = inject(ChatCompletionsService);
  readonly chatMetadataService = inject(ChatMetadataService);

  readonly submitted = output<void>();
  readonly reset = output<void>();
  readonly reasoningChanged = output<ReasoningEffort>();
  /** Emits the current file list every time it changes (add / remove / clear). */
  readonly appendedFilesChanged = output<AppendedFile[]>();

  readonly appendedFiles = signal<AppendedFile[]>([]);

  /** The raw (unrendered) markdown — this is what gets sent to the AI. */
  readonly rawText = signal<string>('');

  /** Whether the preview panel is active. */
  readonly previewMode = signal<boolean>(false);

  /** Focus state for the glow ring. */
  readonly focused = signal<boolean>(false);

  /** Whether a voice recording is currently in progress. */
  readonly recording = signal<boolean>(false);
  private readonly recordingElapsedSec = signal<number>(0);
  private recorder?: AudioRecorder;
  private recordingTimer?: ReturnType<typeof setInterval>;

  private _viewReady = false;
  private _formSub?: Subscription;

  constructor() {
    // Re-bind whenever the parent swaps the FormGroup instance — a one-time
    // ngAfterViewInit subscription would keep listening to the stale form.
    effect(() => {
      const form = this.form();
      if (!this._viewReady) return;
      this._bindForm(form);
    });
  }

  ngAfterViewInit(): void {
    this._viewReady = true;
    this._bindForm(this.form());
  }

  ngOnDestroy(): void {
    this._formSub?.unsubscribe();
    if (this.recordingTimer) clearInterval(this.recordingTimer);
    this.recorder?.stop();
  }

  private _bindForm(form: FormGroup): void {
    this._formSub?.unsubscribe();
    const ctrl = form.get('input');

    const value = ctrl?.value ?? '';
    this.rawText.set(value);
    this._syncEditableDiv(value);

    // Stay in sync if the parent patches the form control programmatically
    // (e.g. reply pre-fill or clear after send).
    this._formSub = ctrl?.valueChanges.subscribe((v: string) => {
      if (v !== this.rawText()) {
        this.rawText.set(v ?? '');
        this._syncEditableDiv(v ?? '');
      }
    });
  }

  // ── Editable div ────────────────────────────────────────────────────────────

  onEditableInput(): void {
    const el = this.editableDivRef?.nativeElement;
    if (!el) return;
    const text = el.innerText ?? '';
    this.rawText.set(text);
    // Patch the FormControl so validators and submit work normally.
    // emitEvent: false avoids the valueChanges loop.
    this.form().get('input')?.setValue(text, { emitEvent: false });
  }

  // ── Preview toggle ──────────────────────────────────────────────────────────

  togglePreview(): void {
    this.previewMode.update((v) => !v);
    if (this.previewMode()) {
      // Entering preview — schedule a Prism highlight pass
      this._needsPrismHighlight = true;
    } else {
      setTimeout(() => this._focusEditableAtEnd(), 0);
    }
  }

  switchToEdit(): void {
    if (this.previewMode()) {
      this.previewMode.set(false);
      setTimeout(() => this._focusEditableAtEnd(), 0);
    }
  }

  // ── AfterViewChecked ────────────────────────────────────────────────────────

  ngAfterViewChecked(): void {
    if (this._needsPrismHighlight && this.previewMode()) {
      const el = this.previewDivRef?.nativeElement;
      if (el) {
        Prism.highlightAllUnder(el);
      }
      this._needsPrismHighlight = false;
    }
  }

  // ── Keyboard ────────────────────────────────────────────────────────────────

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submitted.emit();
    }
  }

  // ── Files ───────────────────────────────────────────────────────────────────

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) return;

    const file = files[0];
    if (['jpeg', 'jpg', 'png', 'svg'].includes(file.name.split('.')[1])) {
      readFilesAsDataUrls(files).then((newFiles) => {
        this.appendedFiles.update((existing) => {
          const merged = mergeFiles(existing, newFiles);
          this.appendedFilesChanged.emit(merged);
          return merged;
        });
      });
    } else {
      (this.chatCompletionsService.currentChatId()
        ? of(this.chatCompletionsService.currentChatId()!)
        : this.newChatIdProvider()()
      )
        .pipe(
          take(1),
          switchMap((chatId) => this.chatMetadataService.uploadFile(chatId, file)),
        )
        .subscribe((res) => {
          this.appendedFiles.update((existing) => {
            const merged = mergeFiles(existing, [
              {
                type: 'input_file',
                filename: res.filename,
                id: res.internalFilename,
                assetUrl: res.assetUrl,
                sizeKb: res.sizeKb,
              },
            ]);
            this.appendedFilesChanged.emit(merged);
            return merged;
          });
          console.log(res);
        });
    }
  }

  /*


   */

  // ── Voice recording ─────────────────────────────────────────────────────────

  recordingElapsedLabel(): string {
    const s = this.recordingElapsedSec();
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  async toggleMic(): Promise<void> {
    if (this.recording()) {
      await this.stopRecording();
      return;
    }

    try {
      this.recorder = new AudioRecorder();
      await this.recorder.start();
      this.recording.set(true);
      this.recordingElapsedSec.set(0);
      this.recordingTimer = setInterval(() => {
        this.recordingElapsedSec.update((s) => s + 1);
      }, 1000);
    } catch (error) {
      console.error('Microphone access failed:', error);
      this.recorder = undefined;
      this.recording.set(false);
    }
  }

  private async stopRecording(): Promise<void> {
    if (this.recordingTimer) clearInterval(this.recordingTimer);
    this.recordingTimer = undefined;
    this.recording.set(false);

    const recorder = this.recorder;
    this.recorder = undefined;
    if (!recorder) return;

    const { dataUrl } = await recorder.stop();
    const base64 = dataUrl.split(',')[1] ?? '';

    this.appendedFiles.update((existing) => {
      const merged = mergeFiles(existing, [
        {
          type: 'input_audio',
          filename: `voice-${Date.now()}.wav`,
          audio_url: dataUrl,
          audio_data: base64,
          audio_format: 'wav',
          userRecorded: true,
        },
      ]);
      this.appendedFilesChanged.emit(merged);
      return merged;
    });
  }

  removeFile(index: number): void {
    this.appendedFiles.update((files) => {
      const updated = files.filter((_, i) => i !== index);
      this.appendedFilesChanged.emit(updated);
      return updated;
    });
  }

  /** Called from the parent after a message is sent to clear the file list. */
  clearFiles(): void {
    this.appendedFiles.set([]);
    this.appendedFilesChanged.emit([]);
  }

  /**
   * Clears both the editable div and the form control.
   * Call this from the parent after a successful send instead of (or in
   * addition to) patching the form control directly.
   */
  clearInput(): void {
    this.rawText.set('');
    this.previewMode.set(false);
    const el = this.editableDivRef?.nativeElement;
    if (el) el.innerText = '';
    this.form().get('input')?.setValue('', { emitEvent: false });
  }

  fileSizeLabel(dataUrl: string): string {
    return fileSizeLabel(dataUrl);
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private _syncEditableDiv(text: string): void {
    const el = this.editableDivRef?.nativeElement;
    if (el && el.innerText !== text) {
      el.innerText = text;
    }
  }

  private _focusEditableAtEnd(): void {
    const el = this.editableDivRef?.nativeElement;
    if (!el) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
}
