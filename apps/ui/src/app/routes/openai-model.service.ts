import { inject, Injectable } from '@angular/core';
import { ModelOpenAiDto, OpenAIService, ReasoningDto } from '../client';
import { ModelReasoningCapability } from '../shared';
import { AbstractModel, AbstractModelService, ReasoningValue } from './abstract-model.service';

/**
 * `ModelOpenAiDto` already carries an `id` field, so no extra mapping is
 * required — we simply intersect it with `AbstractModel` for the type system.
 */
export type OpenAiModel = ModelOpenAiDto & AbstractModel;

@Injectable()
export class OpenAiModelService extends AbstractModelService<OpenAiModel> {
  private readonly openAiService = inject(OpenAIService);

  // ── AbstractModelService contract ────────────────────────────────────────

  protected override get storageKey(): string {
    return 'openai-model';
  }

  getModelId(model: OpenAiModel): string {
    return model.id;
  }

  protected override matchModel(id: string, list: OpenAiModel[]): OpenAiModel | undefined {
    return list.find((m) => m.id === id);
  }

  /**
   * Every OpenAI model supports reasoning via `ReasoningDto.EffortEnum`.
   * The capability is therefore static — it does not depend on the selected
   * model instance.
   */
  protected override getReasoningCap(_model: OpenAiModel | null): ModelReasoningCapability {
    const options = Object.values(ReasoningDto.EffortEnum);
    return {
      allowed_options: options,
      default: options[0],
    };
  }

  protected override fetchModels(): void {
    this.openAiService.getModelsOpenAi().subscribe({
      next: (models) => {
        const typedModels = models as OpenAiModel[];
        this.models.set(typedModels);

        const current = this.selectedModel();
        if (!current && typedModels.length > 0) {
          this.selectModel(typedModels[0]);
        } else if (current) {
          const match = this.matchModel(current.id, typedModels);
          if (match) this.selectModel(match);
        }

        this.modelsLoading.set(false);
      },
      error: () => this.modelsLoading.set(false),
    });
  }

  // ── OpenAI-specific helpers ───────────────────────────────────────────────

  /**
   * Cast-safe setter for the OpenAI-specific `ReasoningDto.EffortEnum` value.
   * Components that know they are working with OpenAI can use this overload
   * instead of the base `setReasoning(string | undefined)`.
   */
  setEffort(value: ReasoningDto.EffortEnum | undefined): void {
    this.setReasoning(value as ReasoningValue);
  }

  /** Typed accessor for the current reasoning effort level. */
  get effort(): ReasoningDto.EffortEnum | undefined {
    return this.reasoning() as ReasoningDto.EffortEnum | undefined;
  }
}
