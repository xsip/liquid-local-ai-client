import { computed, inject, Injectable, signal } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  OpenAiStreamService,
  McpCallProgressEvent,
} from './completions-openai-stream.service';
import { OpenAiStreamErrorEvent, OpenAiStreamApiInfoEvent } from './openai-stream.service';
import {
  ChatMetadataService,
  CreateChatMetadataDto,
  ReasoningDto,
} from '../../client';
import { AppendedFile } from './chat-input.component';
import * as CryptoJS from 'crypto-js';

export interface ChatMessage {
  role: 'user' | 'ai' | 'error' | 'info' | 'tool_call' | 'reasoning' | 'mcp_list_tools';
  text: string;
  date?: Date;
  stats?: string;
  streaming?: boolean;
  toolName?: string;
  toolArguments?: object;
  toolOutput?: string;
  toolFailed?: boolean;
  providerLabel?: string;
  collapsed?: boolean;
  itemId?: string; // track by OpenAI item id
}

@Injectable()
export class ChatCompletionsService {
  private readonly streamService = inject(OpenAiStreamService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly chatMetaService = inject(ChatMetadataService);
  readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    input: ['', [Validators.required, Validators.minLength(1)]],
  });

  readonly streaming = signal(false);
  readonly chatMessages = signal<ChatMessage[]>([]);
  readonly currentChatId = signal<string | null>(null);

  private readonly lastUserInput = signal<string>('');
  private sub?: Subscription;

  readonly showResend = computed(() => {
    const msgs = this.chatMessages();
    const last = msgs[msgs.length - 1];
    if (!last || last.role !== 'info') return false;
    return !!this.lastUserInput();
  });

  readonly hasChatOpen = computed(() => this.currentChatId() !== null);

  toggleCollapsed(index: number): void {
    this.chatMessages.update((msgs) => {
      const copy = [...msgs];
      copy[index] = { ...copy[index], collapsed: !copy[index].collapsed };
      return copy;
    });
  }

  lastIndexWhere(msgs: ChatMessage[], pred: (m: ChatMessage) => boolean): number {
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (pred(msgs[i])) return i;
    }
    return -1;
  }

  patchLast(pred: (m: ChatMessage) => boolean, patch: Partial<ChatMessage>): void {
    this.chatMessages.update((msgs) => {
      const idx = this.lastIndexWhere(msgs, pred);
      if (idx === -1) return msgs;
      const copy = [...msgs];
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });
  }

  patchByItemId(itemId: string, patch: Partial<ChatMessage>): void {
    this.chatMessages.update((msgs) => {
      const idx = this.lastIndexWhere(msgs, (m) => m.itemId === itemId);
      if (idx === -1) return msgs;
      const copy = [...msgs];
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });
  }

  submit(
    selectedModelId: string,
    reasoning: ReasoningDto.EffortEnum | undefined,
    appendedFiles: AppendedFile[] | undefined,
    encryptionKey: string | undefined,
    onChatListRefresh: () => void,
    newChatOptions?: {
      name?: string;
      useCrypto?: boolean;
      cryptoKey?: string;
      openAiEndpointPreference?: CreateChatMetadataDto.OpenAiEndpointPreferenceEnum;
    },
  ): void {
    if (this.form.invalid || this.streaming()) return;
    let input = this.form.getRawValue().input!.trim();

    this.lastUserInput.set(input);
    this.form.reset();
    this.streaming.set(true);

    this.chatMessages.update((msgs) => [...msgs, { role: 'user', text: input, date: new Date() }]);
    this.chatMessages.update((msgs) => [...msgs, { role: 'ai', text: '', streaming: true }]);

    this.streamService.reset();
    this.sub?.unsubscribe();

    this.sub = this.streamService.events$.subscribe({
      next: (event) => {
        switch ((event as any).type) {
          // ── MCP tool call progress ─────────────────────────────────────────
          case 'response.mcp_call.in_progress': {
            const e = event as McpCallProgressEvent;
            this.chatMessages.update((msgs) => [
              ...msgs,
              {
                role: 'tool_call',
                text: '',
                streaming: true,
                collapsed: false,
                date: new Date(),
                toolName: e.name,
                toolArguments: e.arguments,
              },
            ]);
            break;
          }

          case 'response.mcp_call.completed': {
            const e = event as McpCallProgressEvent;
            this.chatMessages.update((msgs) => {
              const idx = this.lastIndexWhere(
                msgs,
                (m) => m.role === 'tool_call' && m.toolName === e.name && !!m.streaming,
              );
              if (idx === -1) return msgs;
              const copy = [...msgs];
              copy[idx] = {
                ...copy[idx],
                streaming: false,
                collapsed: true,
                toolArguments: e.arguments ?? copy[idx].toolArguments,
                toolOutput: e.output,
              };
              return copy;
            });
            break;
          }

          // ── Stream errors ─────────────────────────────────────────────────
          case 'error': {
            const e = event as OpenAiStreamErrorEvent;
            this.chatMessages.update((msgs) => {
              const filtered = msgs[msgs.length - 1]?.streaming ? msgs.slice(0, -1) : msgs;
              return [
                ...filtered,
                {
                  role: 'error' as const,
                  text: e.message ?? e.error?.message ?? 'Unknown error',
                  date: new Date(),
                },
              ];
            });
            this.streaming.set(false);
            break;
          }

          case 'api.info': {
            const e = event as OpenAiStreamApiInfoEvent;
            this.chatMessages.update((msgs) => {
              const filtered = msgs[msgs.length - 1]?.streaming ? msgs.slice(0, -1) : msgs;
              return [...filtered, { role: 'info' as const, text: e.message, date: new Date() }];
            });
            break;
          }
        }
      },
      complete: () => this.streaming.set(false),
      error: () => this.streaming.set(false),
    });

    // Text deltas arrive through the dedicated subject
    this.streamService.messageDelta$.subscribe((chunk) => {
      this.chatMessages.update((msgs) => {
        const copy = [...msgs];
        const idx = this.lastIndexWhere(copy, (m) => m.role === 'ai' && !!m.streaming);
        if (idx !== -1) copy[idx] = { ...copy[idx], text: copy[idx].text + chunk };
        return copy;
      });
    });

    this.streamService.chatEnd$.subscribe(() => {
      this.chatMessages.update((msgs) =>
        msgs.map((m) => {
          if (m.role === 'ai' && m.streaming) return { ...m, streaming: false };
          if (m.role === 'tool_call' && m.streaming) {
            return { ...m, streaming: false, collapsed: true };
          }
          return m;
        }),
      );
      onChatListRefresh();
    });

    this.streamService.newChatCreated$.subscribe((result) => {
      if (this.currentChatId() !== result) {
        this.currentChatId.set(result);
        this.location.replaceState(`/chat-openai/${result}`);
      }
    });

    this.streamService.chat(
      {
        model: selectedModelId,
        messages: [
          {
            role: 'user',
            content: [{ type: 'text', text: input }],
          },
        ],
        stream: true,
      },
      this.currentChatId() ?? undefined,
      this.currentChatId() ? undefined : newChatOptions,
    );
  }

  resend(
    selectedModelId: string,
    reasoning: ReasoningDto.EffortEnum | undefined,
    appendedFiles: AppendedFile[] | undefined,
    encryptionKey: string | undefined,
    onChatListRefresh: () => void,
  ): void {
    const input = this.lastUserInput();
    if (!input || this.streaming()) return;
    this.form.setValue({ input });
    this.submit(selectedModelId, reasoning, appendedFiles, encryptionKey, onChatListRefresh);
  }

  reset(): void {
    this.sub?.unsubscribe();
    this.streamService.reset();
    this.streaming.set(false);
    this.chatMessages.update((msgs) => msgs.filter((m) => !m.streaming));
  }

  destroy(): void {
    this.sub?.unsubscribe();
  }
}
