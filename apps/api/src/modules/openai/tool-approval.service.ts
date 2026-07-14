import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type ToolApprovalDecision = 'approve' | 'deny' | 'always';

interface PendingApproval {
  resolve: (decision: ToolApprovalDecision) => void;
}

/**
 * Gates tool/MCP calls behind a user approval step when a chat has
 * `toolsRequireApproval` enabled. The generation loop in `OpenaiService`
 * awaits `request().promise` before invoking a tool; the frontend resolves
 * it via `POST openai/tool-approval/:requestId`. "Always allow" decisions
 * are persisted on `ChatMetadata.alwaysAllowedTools`, not here.
 */
@Injectable()
export class ToolApprovalService {
  private readonly pending = new Map<string, PendingApproval>();

  request(): { requestId: string; promise: Promise<ToolApprovalDecision> } {
    const requestId = randomUUID();
    const promise = new Promise<ToolApprovalDecision>((resolve) => {
      this.pending.set(requestId, { resolve });
    });
    return { requestId, promise };
  }

  resolve(requestId: string, decision: ToolApprovalDecision): boolean {
    const entry = this.pending.get(requestId);
    if (!entry) return false;
    this.pending.delete(requestId);
    entry.resolve(decision);
    return true;
  }
}
