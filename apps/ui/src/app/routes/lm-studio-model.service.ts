import { inject, Injectable } from '@angular/core';
import { ChatRequestDto, ModelDto } from '../client';
import { LMStudioService } from '../client';
import { ModelReasoningCapability } from '../shared';
import { AbstractModel, AbstractModelService } from './abstract-model.service';



@Injectable()
export class LmStudioModelService extends AbstractModelService<ModelDto> {
  private readonly lmStudioService = inject(LMStudioService);

  // ── AbstractModelService contract ────────────────────────────────────────

  protected override get storageKey(): string {
    return 'lmstudio_selected_model';
  }

  getModelId(model: ModelDto): string {
    return model.key;
  }

  protected override matchModel(id: string, list: ModelDto[]): ModelDto | undefined {
    return list.find((m) => m.key === id);
  }

  protected override getReasoningCap(model: ModelDto | null): ModelReasoningCapability | null {
    const cap = (model?.capabilities as any)?.reasoning as ModelReasoningCapability | undefined;
    return cap ?? null;
  }

  protected override fetchModels(): void {
    this.lmStudioService.getModels().subscribe({
      next: (res) => {
        const llms = (res.models as ModelDto[])
          .filter((m) => m.type === ModelDto.TypeEnum.Llm)
          // Ensure every entry satisfies AbstractModel (map key → id)
          .map((m) => ({ ...m, id: m.key }));

        this.models.set(llms);

        // Re-select the previously chosen model if it is in the new list
        const current = this.selectedModel();
        if (current) {
          const match = this.matchModel(this.getModelId(current), llms);
          if (match) this.selectModel(match);
        } else if (llms.length > 0) {
          this.selectModel(llms[0]);
        }

        this.modelsLoading.set(false);
      },
      error: () => this.modelsLoading.set(false),
    });
  }

  // ── LM Studio-specific helpers ────────────────────────────────────────────

  /**
   * Validate a reasoning value against the capability of the currently
   * selected model before applying it.  Returns `true` when the value was
   * accepted and applied, `false` when it was rejected.
   */
  applyReasoningIfAllowed(value: ChatRequestDto.ReasoningEnum): boolean {
    const allowed = this.modelReasoningCap()?.allowed_options;
    if (!allowed || allowed.includes(value)) {
      this.setReasoning(value);
      return true;
    }
    return false;
  }

  /**
   * Resolve a pending model key that was known before the model list
   * finished loading (e.g. restored from chat metadata).
   */
  resolvePendingModelKey(key: string): void {
    const match = this.matchModel(key, this.models());
    if (match) this.selectModel(match);
  }
}
