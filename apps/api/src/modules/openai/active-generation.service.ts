import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';

interface ActiveGeneration {
  emitter: EventEmitter;
  /** Raw SSE text blocks already sent for this generation — replayed to late subscribers. */
  buffer: string[];
}

/**
 * Tracks in-flight chat generations per `internalChatId` so a client that
 * reconnects mid-generation (e.g. after a page refresh) can replay everything
 * already streamed and then keep receiving live chunks, instead of only being
 * able to poll the lock flag and re-fetch history once it's fully done.
 */
@Injectable()
export class ActiveGenerationService {
  private readonly generations = new Map<string, ActiveGeneration>();

  start(chatId: string): void {
    this.generations.set(chatId, { emitter: new EventEmitter(), buffer: [] });
  }

  /** Records a raw SSE text block and forwards it to any live subscribers. */
  push(chatId: string, chunk: string): void {
    const gen = this.generations.get(chatId);
    if (!gen) return;
    gen.buffer.push(chunk);
    gen.emitter.emit('data', chunk);
  }

  /** Signals subscribers that generation is done, then drops the buffer. */
  finish(chatId: string): void {
    const gen = this.generations.get(chatId);
    if (!gen) return;
    gen.emitter.emit('end');
    this.generations.delete(chatId);
  }

  isActive(chatId: string): boolean {
    return this.generations.has(chatId);
  }

  /**
   * Subscribes to an in-flight generation: `onChunk` is called once per
   * buffered block already sent (in order), then again for every future
   * live chunk; `onEnd` fires once the generation finishes. Returns an
   * unsubscribe function.
   */
  subscribe(
    chatId: string,
    onChunk: (chunk: string) => void,
    onEnd: () => void,
  ): (() => void) | undefined {
    const gen = this.generations.get(chatId);
    if (!gen) return undefined;

    for (const chunk of gen.buffer) onChunk(chunk);

    gen.emitter.on('data', onChunk);
    gen.emitter.once('end', onEnd);

    return () => {
      gen.emitter.off('data', onChunk);
      gen.emitter.off('end', onEnd);
    };
  }
}
