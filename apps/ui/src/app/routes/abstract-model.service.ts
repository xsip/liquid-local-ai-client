import { computed, signal } from '@angular/core';
import { ModelReasoningCapability } from '../shared';

/**
 * A generic model descriptor that both LM Studio and OpenAI models can be
 * narrowed to / widened from.  Each concrete service works with its own
 * strongly-typed subtype internally; this shape is the contract exposed to
 * consumers of the abstract service.
 */
export interface AbstractModel {
  /** Unique identifier used when submitting chat requests. */
  id?: string;
  /** Human-readable display name. */
  name?: string;
}

/**
 * The reasoning value type accepted by both providers.
 * LM Studio uses `ChatRequestDto.ReasoningEnum`; OpenAI uses
 * `ReasoningDto.EffortEnum`.  Both are string unions, so a plain `string`
 * (or `undefined`) is the safe common type.
 */
export type ReasoningValue = string | undefined;

/**
 * AbstractModelService
 *
 * Encapsulates the three concerns that are identical across providers:
 *  - the list of available models (loading, selection, localStorage cache)
 *  - the active reasoning value
 *  - the derived `modelReasoningCap` computed signal
 *
 * Concrete subclasses must implement:
 *  - `storageKey`          – localStorage key for the persisted model
 *  - `fetchModels()`       – call the provider API and return the model list
 *  - `getModelId(model)`   – extract the string id used in chat requests
 *  - `matchModel(id, list)`– find a model in the list by id
 *  - `getReasoningCap(model)` – derive `ModelReasoningCapability | null`
 */
export abstract class AbstractModelService<TModel> {
  // ── Models ──────────────────────────────────────────────────────────────

  readonly models = signal<TModel[]>([]);
  readonly modelsLoading = signal(false);
  readonly selectedModel = signal<TModel | null>(this.loadStoredModel());

  // ── Reasoning ────────────────────────────────────────────────────────────

  readonly reasoning = signal<ReasoningValue>(undefined);

  readonly modelReasoningCap = computed<ModelReasoningCapability | null>(() =>
    this.getReasoningCap(this.selectedModel()),
  );

  // ── Abstract contract ────────────────────────────────────────────────────

  /** localStorage key used to persist the selected model. */
  protected abstract get storageKey(): string;

  /** Call the provider-specific API and return the model list. */
  protected abstract fetchModels(): void;

  /**
   * Return the string identifier that should be passed as the model key/id
   * in a chat request for the given model object.
   */
  abstract getModelId(model: TModel): string;

  /**
   * Find the model in `list` whose identifier matches `id`.
   * Used after a model list refresh to re-select the previously chosen model.
   */
  protected abstract matchModel(id: string, list: TModel[]): TModel | undefined;

  /**
   * Derive the `ModelReasoningCapability` metadata for the given model,
   * or `null` when the model has no reasoning capability.
   */
  protected abstract getReasoningCap(model: TModel | null): ModelReasoningCapability | null;

  // ── Model management ─────────────────────────────────────────────────────

  /** Load and refresh the model list from the provider. */
  loadModels(): void {
    this.modelsLoading.set(true);
    this.fetchModels();
  }

  /** Select a model, updating the signal and persisting to localStorage. */
  selectModel(model: TModel): void {
    this.selectedModel.set(model);
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(model));
    } catch {
      /* ignore write errors (e.g. private browsing quota) */
    }
  }

  // ── Reasoning management ─────────────────────────────────────────────────

  /**
   * Update the active reasoning value.
   * Concrete components call this in response to user interaction and may
   * additionally persist the value to the backend via `ChatMetadataService`.
   */
  setReasoning(value: ReasoningValue): void {
    this.reasoning.set(value);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private loadStoredModel(): TModel | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as TModel) : null;
    } catch {
      return null;
    }
  }
}
