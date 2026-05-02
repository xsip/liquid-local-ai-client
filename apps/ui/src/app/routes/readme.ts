import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroCommandLine,
  heroSun,
  heroMoon,
  heroChatBubbleOvalLeft,
  heroBolt,
  heroComputerDesktop,
  heroServer,
  heroInformationCircle,
  heroExclamationTriangle,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-readme',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, NgIconComponent],
  viewProviders: [
    provideIcons({
      heroCommandLine,
      heroSun,
      heroMoon,
      heroChatBubbleOvalLeft,
      heroBolt,
      heroComputerDesktop,
      heroServer,
      heroInformationCircle,
      heroExclamationTriangle,
    }),
  ],
  styles: [
    `
      :host {
        display: block;
      }

      pre {
        white-space: pre;
        overflow-x: auto;
        max-width: 100%;
        word-break: normal;
        overflow-wrap: normal;
      }

      .hero-grid {
        background-image:
          linear-gradient(var(--color-border-subtle) 1px, transparent 1px),
          linear-gradient(90deg, var(--color-border-subtle) 1px, transparent 1px);
        background-size: 32px 32px;
      }

      .badge-pill {
        display: inline-flex;
        align-items: center;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        padding: 3px 10px;
        border-radius: 9999px;
      }

      .card-hover {
        transition: transform 0.2s ease;
      }
      .card-hover:hover {
        transform: translateY(-2px);
      }

      .step-line::before {
        content: '';
        position: absolute;
        left: 19px;
        top: 40px;
        bottom: -12px;
        width: 2px;
        background: linear-gradient(to bottom, var(--color-accent), transparent);
      }

      .img-placeholder {
        background: linear-gradient(
          135deg,
          var(--color-surface-overlay) 0%,
          var(--color-surface-sunken) 50%,
          var(--color-surface-overlay) 100%
        );
        border: 1px dashed var(--color-border-strong);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: var(--color-text-muted);
        font-size: 0.75rem;
      }

      .encrypt-flow-step {
        position: relative;
      }
      .encrypt-flow-step:not(:last-child)::after {
        content: '↓';
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        color: var(--color-accent);
        font-size: 1.1rem;
        line-height: 1;
      }
    `,
  ],
  template: `
    <div class="min-h-screen bg-surface-base text-text-primary">
      <!-- ── HEADER ─────────────────────────────────────────────────────────── -->
      <header
        class="sticky top-0 z-50 border-b border-border-default bg-surface-base/90 backdrop-blur-md"
      >
        <div class="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
          <div class="flex items-center gap-2.5 min-w-0">
            <span
              class="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0"
            >
              <ng-icon name="heroCommandLine" class="w-4 h-4 text-accent" />
            </span>
            <span class="font-semibold text-sm text-text-primary truncate"
            >LM Studio Chat Client</span
            >
            <span
              class="hidden sm:inline-flex badge-pill bg-accent/10 text-accent-text border border-accent/20 ml-1"
            >docs</span
            >
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <!-- Theme toggle: reads .dark from <html> set by the app -->
            <button
              (click)="toggleTheme()"
              class="w-8 h-8 rounded-lg flex items-center justify-center border border-border-default bg-surface-raised hover:bg-surface-overlay text-text-secondary hover:text-text-primary transition-colors"
              [title]="'darkMode.toggle' | translate"
            >
              <!-- Sun shown in dark mode -->
              <ng-icon name="heroSun" class="w-4 h-4 hidden dark:block" />
              <!-- Moon shown in light mode -->
              <ng-icon name="heroMoon" class="w-4 h-4 block dark:hidden" />
            </button>

            <a
              routerLink="/chat-openai"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-xs transition-colors whitespace-nowrap"
            >
              <ng-icon name="heroChatBubbleOvalLeft" class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Go to Chat</span>
              <span class="sm:hidden">Chat</span>
            </a>
          </div>
        </div>
      </header>

      <!-- ── HERO ───────────────────────────────────────────────────────────── -->
      <section class="hero-grid relative overflow-hidden border-b border-border-default">
        <div
          class="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-reasoning-bg pointer-events-none"
        ></div>
        <div class="relative max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
          <div class="flex flex-wrap items-center gap-2 mb-6">
            <span class="badge-pill bg-accent/10 text-accent-text border border-accent/20"
            >Angular 21</span
            >
            <span
              class="badge-pill bg-reasoning-bg text-reasoning-text border border-reasoning-border"
            >NestJS 11</span
            >
            <span class="badge-pill bg-tool-bg text-tool-text border border-tool-border"
            >MongoDB</span
            >
            <span class="badge-pill bg-success-bg text-success-text border border-success-border"
            >MCP</span
            >
            <span class="badge-pill bg-warn-bg text-warn-text border border-warn-border"
            >AES Encryption</span
            >
          </div>

          <h1
            class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary mb-4 leading-tight"
          >
            LM Studio<br />
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-accent to-reasoning-text"
            >Chat Client</span
            >
          </h1>
          <p class="text-lg sm:text-xl text-text-secondary max-w-2xl mb-8 leading-relaxed">
            A full-stack AI chat interface for locally running LM Studio instances — with real-time
            SSE streaming, MCP tool support, and optional end-to-end AES message encryption.
          </p>

          <div class="flex flex-wrap gap-3">
            <a
              href="#getting-started"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-colors"
            >
              <ng-icon name="heroBolt" class="w-4 h-4" />
              Get Started
            </a>
            <a
              href="#architecture"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-raised hover:bg-surface-overlay border border-border-default text-text-primary font-semibold text-sm transition-colors"
            >
              Architecture
            </a>
          </div>
        </div>
      </section>

      <!-- ── BODY ───────────────────────────────────────────────────────────── -->
      <div class="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-20">
        <!-- OVERVIEW IMAGE -->
        <section>
          <img class="dark:hidden block" src="chat-preview-light.png" alt="chat overview light" />
          <img class="dark:block hidden" src="chat-preview-dark.png" alt="chat overview dark" />
        </section>

        <!-- OVERVIEW -->
        <section>
          <h2 class="text-2xl font-bold text-text-primary mb-2">Overview</h2>
          <p class="text-text-secondary mb-6">
            This Nx monorepo contains two applications that work together as a single product.
          </p>
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="card-hover bg-surface-raised border border-border-default rounded-xl p-6">
              <div class="flex items-center gap-3 mb-3">
                <span
                  class="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center text-accent"
                >
                  <ng-icon name="heroComputerDesktop" class="w-5 h-5" />
                </span>
                <div>
                  <p class="font-semibold text-text-primary">UI</p>
                  <code class="text-xs text-accent">apps/ui</code>
                </div>
              </div>
              <p class="text-sm text-text-secondary">
                Angular 21 single-page application with real-time SSE streaming, two chat routes (LM
                Studio API &amp; OpenAI Responses), and a Markdown-rendering message view.
              </p>
            </div>

            <div class="card-hover bg-surface-raised border border-border-default rounded-xl p-6">
              <div class="flex items-center gap-3 mb-3">
                <span
                  class="w-9 h-9 rounded-lg bg-reasoning-bg flex items-center justify-center text-reasoning-text"
                >
                  <ng-icon name="heroServer" class="w-5 h-5" />
                </span>
                <div>
                  <p class="font-semibold text-text-primary">API</p>
                  <code class="text-xs text-reasoning-text">apps/api</code>
                </div>
              </div>
              <p class="text-sm text-text-secondary">
                NestJS 11 backend acting as an authenticated LM Studio proxy, MCP server, and
                MongoDB persistence layer with JWT auth and token rate limiting.
              </p>
            </div>
          </div>
        </section>

        <!-- ARCHITECTURE -->
        <section id="architecture">
          <h2 class="text-2xl font-bold text-text-primary mb-2">Architecture</h2>
          <p class="text-text-secondary mb-6">
            During inference, LM Studio calls back into the NestJS MCP server with the user's JWT
            forwarded in
            <code class="text-xs bg-surface-overlay px-1.5 py-0.5 rounded text-accent"
            >Authorization</code
            >, giving MCP tools full access to the authenticated user's context.
          </p>
          <!--<div class="img-placeholder rounded-xl w-full h-56 sm:h-80 mb-6">
            <svg
              class="w-10 h-10 text-tool-text/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>[ Diagram: Architecture / Request Flow ]</span>
          </div>!-->
          <div class="grid sm:grid-cols-3 gap-3">
            <div class="bg-surface-raised border border-border-default rounded-lg p-4 text-center">
              <p class="text-text-muted text-xs uppercase tracking-wider font-semibold mb-1">
                Frontend
              </p>
              <p class="font-medium text-text-primary">Angular 21</p>
              <p class="text-text-muted text-xs mt-1">localhost:4200</p>
            </div>
            <div class="bg-accent-subtle border border-accent/25 rounded-lg p-4 text-center">
              <p class="text-text-muted text-xs uppercase tracking-wider font-semibold mb-1">
                Backend + MCP
              </p>
              <p class="font-medium text-text-primary">NestJS 11</p>
              <p class="text-text-muted text-xs mt-1">localhost:8888</p>
            </div>
            <div class="bg-surface-raised border border-border-default rounded-lg p-4 text-center">
              <p class="text-text-muted text-xs uppercase tracking-wider font-semibold mb-1">
                AI Runtime
              </p>
              <p class="font-medium text-text-primary">LM Studio</p>
              <p class="text-text-muted text-xs mt-1">localhost:1234</p>
            </div>
          </div>
        </section>

        <!-- TECH STACK -->
        <section>
          <h2 class="text-2xl font-bold text-text-primary mb-6">Tech Stack</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <ng-container *ngFor="let item of techStack">
              <div
                class="card-hover bg-surface-raised border border-border-default rounded-xl p-4 flex flex-col gap-2"
              >
                <span [class]="'badge-pill self-start ' + item.badgeClass">{{ item.layer }}</span>
                <p class="text-sm font-semibold text-text-primary">{{ item.tech }}</p>
                <p class="text-xs text-text-muted">{{ item.version }}</p>
              </div>
            </ng-container>
          </div>
        </section>

        <!-- FEATURES -->
        <section>
          <h2 class="text-2xl font-bold text-text-primary mb-6">Features</h2>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ng-container *ngFor="let feat of features">
              <div
                class="card-hover bg-surface-raised border border-border-default rounded-xl p-5 flex gap-4"
              >
                <span
                  [class]="
                    'mt-0.5 w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center ' +
                    feat.iconBg
                  "
                >
                  <svg
                    class="w-4 h-4"
                    [class]="feat.iconColor"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      [attr.d]="feat.icon"
                    />
                  </svg>
                </span>
                <div>
                  <p class="font-semibold text-sm text-text-primary mb-1">{{ feat.title }}</p>
                  <p class="text-xs text-text-secondary leading-relaxed">{{ feat.desc }}</p>
                </div>
              </div>
            </ng-container>
          </div>
        </section>

        <!-- GETTING STARTED -->
        <section id="getting-started">
          <h2 class="text-2xl font-bold text-text-primary mb-2">Getting Started</h2>
          <p class="text-text-secondary mb-8">Up and running in four steps.</p>
          <div class="space-y-4">
            <ng-container *ngFor="let step of steps; let last = last">
              <div class="relative flex gap-4 sm:gap-5" [class.step-line]="!last">
                <div
                  class="flex-shrink-0 w-10 h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-bold text-sm z-10"
                >
                  {{ step.n }}
                </div>
                <div
                  class="flex-1 min-w-0 bg-surface-raised border border-border-default rounded-xl p-4 sm:p-5 mb-3"
                >
                  <p class="font-semibold text-text-primary mb-2">{{ step.title }}</p>
                  @if (step.desc) {
                    <p class="text-sm text-text-secondary mb-3">{{ step.desc }}</p>
                  }
                  @if (step.code) {
                    <div class="rounded-lg overflow-hidden border border-border-subtle">
                      <pre class="bg-surface-overlay px-4 py-3 text-xs text-accent">{{
                          step.code
                        }}</pre>
                    </div>
                  }
                </div>
              </div>
            </ng-container>
          </div>
        </section>

        <!-- ENV VARS -->
        <section>
          <h2 class="text-2xl font-bold text-text-primary mb-2">Environment Variables</h2>
          <p class="text-text-secondary mb-6">
            Create
            <code class="text-xs bg-surface-overlay px-1.5 py-0.5 rounded text-success-text"
            >apps/api/.env</code
            >
            with the following:
          </p>
          <div class="bg-surface-raised border border-border-default rounded-xl overflow-hidden">
            <div
              class="flex items-center gap-2 px-4 py-2.5 bg-surface-overlay border-b border-border-subtle"
            >
              <span class="w-3 h-3 rounded-full bg-error-muted/70"></span>
              <span class="w-3 h-3 rounded-full bg-warn-muted/70"></span>
              <span class="w-3 h-3 rounded-full bg-success-muted/70"></span>
              <span class="ml-2 text-xs text-text-muted font-mono">apps/api/.env</span>
            </div>
            <div class="overflow-x-auto">
              <pre
                class="px-5 py-4 text-xs leading-relaxed text-text-secondary"
              ><span class="text-text-muted"># MongoDB</span>
<span class="text-success-text">MONGODB_URI</span>=mongodb://localhost:27017/lmStudioWrapper

<span class="text-text-muted"># LM Studio local server</span>
<span class="text-success-text">LM_STUDIO_BASE_URL</span>=http://localhost:1234
<span class="text-success-text">LM_STUDIO_API_TOKEN</span>=            <span class="text-text-muted"># optional</span>

<span class="text-text-muted"># JWT</span>
<span class="text-success-text">JWT_SECRET</span>=your-very-secret-key

<span class="text-text-muted"># Must be reachable FROM LM Studio for MCP callbacks</span>
<span class="text-success-text">SELF_MCP_URL</span>=http://192.168.0.34:8888/tools/mcp

<span class="text-success-text">PORT</span>=8888
<span class="text-success-text">USE_SWAGGER</span>=true       <span
                  class="text-text-muted"># enables /api Swagger UI</span></pre>
            </div>
          </div>
          <div
            class="mt-3 flex gap-2 items-start bg-info-bg border border-info-border rounded-lg px-4 py-3"
          >
            <ng-icon
              name="heroInformationCircle"
              class="w-4 h-4 text-info-text flex-shrink-0 mt-0.5"
            />
            <p class="text-xs text-info-text">
              <strong>SELF_MCP_URL</strong> must be the LAN IP reachable from LM Studio's process —
              not <code class="bg-info-bg px-1 rounded">localhost</code> — so MCP tool callbacks
              succeed during inference.
            </p>
          </div>
        </section>

        <!-- MCP TOOLS -->
        <section>
          <h2 class="text-2xl font-bold text-text-primary mb-2">MCP Tool Integration</h2>
          <p class="text-text-secondary mb-6">
            The NestJS backend registers itself as an MCP server via
            <code class="text-xs bg-surface-overlay px-1.5 py-0.5 rounded text-tool-text"
            >&#64;rekog/mcp-nest</code
            >, exposing both Streamable HTTP and SSE transports at
            <code class="text-xs bg-surface-overlay px-1.5 py-0.5 rounded text-tool-text"
            >/tools/mcp</code
            >. The user's JWT is forwarded with every MCP callback, giving tools full access to
            authenticated user data.
          </p>
          <img
            class="dark:hidden block mb-2"
            src="mcp-preview-light.png"
            alt="chat overview light"
          />
          <img class="dark:block hidden mb-2" src="mcp-preview-dark.png" alt="chat overview dark" />

          <div class="space-y-3 mb-4">
            <ng-container *ngFor="let tool of mcpTools">
              <div
                class="bg-surface-raised border border-border-default rounded-xl p-5 flex flex-col sm:flex-row gap-3 items-start"
              >
                <code
                  class="flex-shrink-0 text-xs bg-tool-bg border border-tool-border text-tool-text px-2.5 py-1 rounded-lg font-mono"
                >{{ tool.name }}</code
                >
                <p class="text-sm text-text-secondary leading-relaxed">{{ tool.desc }}</p>
              </div>
            </ng-container>
          </div>
          <div class="bg-surface-overlay border border-border-subtle rounded-xl p-4">
            <p class="text-xs text-text-secondary">
              To add a new tool: create an <code class="text-accent">&#64;Injectable()</code> class
              in <code class="text-accent">apps/api/src/tools/</code>, decorate methods with
              <code class="text-accent">&#64;Tool(...)</code> from
              <code class="text-accent">&#64;rekog/mcp-nest</code>, and register it as a provider in
              <code class="text-accent">AppModule</code>.
            </p>
          </div>
        </section>

        <!-- ENCRYPTION -->
        <section>
          <h2 class="text-2xl font-bold text-text-primary mb-2">Message Encryption</h2>
          <p class="text-text-secondary mb-8">
            Per-chat AES-256 encryption can be opted into on the OpenAI Responses route. Only
            ciphertext ever reaches LM Studio's message store — plaintext never leaves the NestJS
            trust boundary.
          </p>
          <div class="grid sm:grid-cols-5 gap-6 sm:gap-2 mb-8">
            <ng-container *ngFor="let step of encryptionFlow">
              <div class="encrypt-flow-step flex sm:flex-col items-center gap-3 sm:gap-2">
                <div
                  [class]="
                    'w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-sm border ' +
                    step.circleClass
                  "
                >
                  {{ step.n }}
                </div>
                <div class="flex-1 sm:flex-none sm:text-center">
                  <p class="font-semibold text-xs text-text-primary">{{ step.title }}</p>
                  <p class="text-xs text-text-muted mt-0.5 leading-relaxed">{{ step.detail }}</p>
                </div>
              </div>
            </ng-container>
          </div>

          <h3 class="text-base font-semibold text-text-primary mb-3">
            Key Storage &amp; Security Boundaries
          </h3>
          <div class="overflow-x-auto rounded-xl border border-border-default">
            <table class="w-full text-sm">
              <thead>
              <tr class="bg-surface-overlay text-xs text-text-muted uppercase tracking-wider">
                <th class="text-left px-4 py-3 font-semibold">What</th>
                <th class="text-left px-4 py-3 font-semibold">Where</th>
                <th class="text-left px-4 py-3 font-semibold">Plaintext?</th>
              </tr>
              </thead>
              <tbody>
              <ng-container *ngFor="let row of securityBoundaries; let odd = odd">
                <tr [class]="odd ? 'bg-surface-raised' : 'bg-surface-base'">
                  <td class="px-4 py-3 text-text-primary font-mono text-xs">{{ row.what }}</td>
                  <td class="px-4 py-3 text-text-secondary text-xs">{{ row.where }}</td>
                  <td class="px-4 py-3">
                    @if (row.plaintext) {
                      <span
                        class="badge-pill bg-success-bg text-success-text border border-success-border"
                      >&#10003; Yes</span
                      >
                    }
                    @if (row.plaintext) {
                      <span
                        class="badge-pill bg-error-bg text-error-text border border-error-border"
                      >&#10007; No</span
                      >
                    }
                  </td>
                </tr>
              </ng-container>
              </tbody>
            </table>
          </div>

          <div
            class="mt-4 flex gap-2 items-start bg-warn-bg border border-warn-border rounded-lg px-4 py-3"
          >
            <ng-icon
              name="heroExclamationTriangle"
              class="w-4 h-4 text-warn-text flex-shrink-0 mt-0.5"
            />
            <p class="text-xs text-warn-text">
              The <strong>cryptoKey</strong> lives in MongoDB — your NestJS API and database are the
              security boundary. Use HTTPS and restrict DB access in any non-local deployment.
            </p>
          </div>
        </section>

        <!-- AUTH -->
        <section>
          <h2 class="text-2xl font-bold text-text-primary mb-6">
            Authentication &amp; Authorization
          </h2>
          <div class="grid sm:grid-cols-2 gap-4">
            <ng-container *ngFor="let item of authItems">
              <div class="bg-surface-raised border border-border-default rounded-xl p-5 flex gap-3">
                <span
                  [class]="
                    'mt-0.5 w-7 h-7 flex-shrink-0 rounded-md flex items-center justify-center ' +
                    item.iconBg
                  "
                >
                  <svg
                    class="w-3.5 h-3.5"
                    [class]="item.iconColor"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      [attr.d]="item.icon"
                    />
                  </svg>
                </span>
                <div>
                  <p class="font-semibold text-sm text-text-primary mb-1">{{ item.title }}</p>
                  <p class="text-xs text-text-secondary leading-relaxed">{{ item.desc }}</p>
                </div>
              </div>
            </ng-container>
          </div>
        </section>

        <!-- TOKEN LIMITING -->
        <section>
          <h2 class="text-2xl font-bold text-text-primary mb-2">Token Rate Limiting</h2>
          <p class="text-text-secondary mb-6">
            Token consumption is tracked per user against configurable subscription-tier budgets
            stored in the
            <code class="text-xs bg-surface-overlay px-1.5 py-0.5 rounded text-reasoning-text"
            >token_limit_configs</code
            >
            MongoDB collection.
          </p>
          <div class="grid sm:grid-cols-3 gap-4 mb-5">
            <ng-container *ngFor="let tier of tokenTiers">
              <div [class]="'card-hover rounded-xl p-5 border ' + tier.cardClass">
                <p [class]="'text-xs font-bold uppercase tracking-wider mb-1 ' + tier.labelClass">
                  {{ tier.label }}
                </p>
                <p class="text-2xl font-bold text-text-primary mb-1">{{ tier.tokens }}</p>
                <p class="text-xs text-text-muted">tokens / interval</p>
              </div>
            </ng-container>
          </div>
          <p class="text-xs text-text-muted">
            After each completed inference,
            <code class="text-reasoning-text">TokenLimitService.updateUsedTokens()</code> increments
            the user's counter. If the limit is reached, an
            <code class="text-reasoning-text">api.info</code>
            SSE event is emitted with the reset timestamp. Limits reset automatically when
            <code class="text-reasoning-text">tokenCountResetDate</code> elapses.
          </p>
        </section>

        <!-- API TABLE -->
        <section>
          <h2 class="text-2xl font-bold text-text-primary mb-6">API Overview</h2>
          <div class="overflow-x-auto rounded-xl border border-border-default">
            <table class="w-full text-sm">
              <thead>
              <tr class="bg-surface-overlay text-xs text-text-muted uppercase tracking-wider">
                <th class="text-left px-4 py-3 font-semibold w-20">Method</th>
                <th class="text-left px-4 py-3 font-semibold">Path</th>
                <th class="text-left px-4 py-3 font-semibold hidden sm:table-cell">
                  Description
                </th>
              </tr>
              </thead>
              <tbody>
              <ng-container *ngFor="let route of apiRoutes; let odd = odd">
                <tr [class]="odd ? 'bg-surface-raised' : 'bg-surface-base'">
                  <td class="px-4 py-2.5">
                    <span [class]="'badge-pill ' + route.methodClass">{{ route.method }}</span>
                  </td>
                  <td class="px-4 py-2.5 font-mono text-xs text-text-secondary">
                    {{ route.path }}
                  </td>
                  <td class="px-4 py-2.5 text-xs text-text-muted hidden sm:table-cell">
                    {{ route.desc }}
                  </td>
                </tr>
              </ng-container>
              </tbody>
            </table>
          </div>
          <p class="mt-3 text-xs text-text-muted">
            Full interactive docs at <code class="text-accent">http://localhost:8888/api</code> when
            <code class="text-accent">USE_SWAGGER=true</code>.
          </p>
        </section>

        <!-- FOOTER -->
        <footer
          class="border-t border-border-default pt-8 pb-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-text-muted"
        >
          <p>LM Studio Chat Client &mdash; MIT License</p>
          <div class="flex gap-4">
            <span>Angular <strong class="text-text-secondary">21</strong></span>
            <span>NestJS <strong class="text-text-secondary">11</strong></span>
            <span>Mongoose <strong class="text-text-secondary">9</strong></span>
            <span>&#64;rekog/mcp-nest <strong class="text-text-secondary">1.9</strong></span>
          </div>
        </footer>
      </div>
    </div>
  `,
})
export class ReadmeComponent {
  toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  techStack = [
    {
      layer: 'Frontend',
      tech: 'Angular 21',
      version: '^21.2.0',
      badgeClass: 'bg-accent/10 text-accent-text border border-accent/20',
    },
    {
      layer: 'Backend',
      tech: 'NestJS 11',
      version: '^11.0.1',
      badgeClass: 'bg-reasoning-bg text-reasoning-text border border-reasoning-border',
    },
    {
      layer: 'Language',
      tech: 'TypeScript 5.9',
      version: '~5.9.2',
      badgeClass: 'bg-tool-bg text-tool-text border border-tool-border',
    },
    {
      layer: 'Database',
      tech: 'MongoDB / Mongoose',
      version: '^9.4.1',
      badgeClass: 'bg-success-bg text-success-text border border-success-border',
    },
    {
      layer: 'MCP',
      tech: '@rekog/mcp-nest',
      version: '^1.9.9',
      badgeClass: 'bg-tool-bg text-tool-text border border-tool-border',
    },
    {
      layer: 'Encryption',
      tech: 'CryptoJS AES',
      version: '^4.2.0',
      badgeClass: 'bg-warn-bg text-warn-text border border-warn-border',
    },
    {
      layer: 'Styling',
      tech: 'TailwindCSS 4',
      version: '^4.2.2',
      badgeClass: 'bg-info-bg text-info-text border border-info-border',
    },
    {
      layer: 'OpenAI SDK',
      tech: 'openai',
      version: '^6.34.0',
      badgeClass: 'bg-error-bg text-error-text border border-error-border',
    },
    {
      layer: 'Auth',
      tech: 'JWT + bcrypt',
      version: '^6.0.0',
      badgeClass: 'bg-warn-bg text-warn-text border border-warn-border',
    },
    {
      layer: 'Monorepo',
      tech: 'Nx',
      version: '22.6.5',
      badgeClass: 'bg-reasoning-bg text-reasoning-text border border-reasoning-border',
    },
    {
      layer: 'Markdown',
      tech: 'marked + KaTeX',
      version: '^18 / ^0.16',
      badgeClass: 'bg-success-bg text-success-text border border-success-border',
    },
    {
      layer: 'Streaming',
      tech: 'SSE / RxJS 7',
      version: '^7.8.1',
      badgeClass: 'bg-info-bg text-info-text border border-info-border',
    },
  ];

  features = [
    {
      title: 'Dual API Modes',
      desc: "LM Studio's native /api/v1/chat or the OpenAI-compatible /v1/responses/create — switchable from the UI.",
      icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      iconBg: 'bg-accent/15',
      iconColor: 'text-accent',
    },
    {
      title: 'Real-time SSE Streaming',
      desc: 'Responses are streamed token-by-token to the browser over Server-Sent Events.',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      iconBg: 'bg-tool-bg',
      iconColor: 'text-tool-text',
    },
    {
      title: 'MCP Tool Server',
      desc: "NestJS registers itself as an MCP server. LM Studio can call back into it mid-inference using the user's JWT.",
      icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
      iconBg: 'bg-reasoning-bg',
      iconColor: 'text-reasoning-text',
    },
    {
      title: 'AES Message Encryption',
      desc: 'Per-chat opt-in encryption. Only ciphertext reaches LM Studio; the model decrypts via MCP at inference time.',
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      iconBg: 'bg-warn-bg',
      iconColor: 'text-warn-text',
    },
    {
      title: 'Persistent Chat History',
      desc: 'Every exchange is stored in MongoDB. Conversation continuity via previous_response_id chaining across page refreshes.',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      iconBg: 'bg-success-bg',
      iconColor: 'text-success-text',
    },
    {
      title: 'Token Rate Limiting',
      desc: 'Configurable token budgets per subscription tier with automatic interval resets and SSE limit notifications.',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      iconBg: 'bg-error-bg',
      iconColor: 'text-error-text',
    },
    {
      title: 'JWT Authentication',
      desc: 'Login / register with bcrypt-hashed passwords. Tokens expire after 1 hour; Angular auto-redirects on expiry.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      iconBg: 'bg-success-bg',
      iconColor: 'text-success-text',
    },
    {
      title: 'Reasoning Mode',
      desc: 'Pass reasoning effort (off / low / medium / high) to supported models via the OpenAI Responses endpoint.',
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      iconBg: 'bg-reasoning-bg',
      iconColor: 'text-reasoning-text',
    },
    {
      title: 'Swagger UI',
      desc: 'Optional OpenAPI documentation at /api. Enabled by setting USE_SWAGGER=true in the environment.',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      iconBg: 'bg-info-bg',
      iconColor: 'text-info-text',
    },
  ];

  steps = [
    { n: '1', title: 'Install dependencies', desc: 'From the monorepo root:', code: 'npm install' },
    {
      n: '2',
      title: 'Configure environment',
      desc: 'Create apps/api/.env — see the Environment Variables section below.',
      code: null,
    },
    {
      n: '3',
      title: 'Start API & UI',
      desc: 'Run each in a separate terminal, or both at once:',
      code: `nx serve api          # → http://localhost:8888\nnx serve ui           # → http://localhost:4200\n\n# Or start both simultaneously:\nnpm start`,
    },
    {
      n: '4',
      title: 'Register a user',
      desc: 'Use Swagger UI at /api or curl:',
      code: `curl -X POST http://localhost:8888/auth/register \\\n  -H "Content-Type: application/json" \\\n  -d '{"username":"alice","password":"s3cret"}'`,
    },
  ];

  mcpTools = [
    {
      name: 'get-token-usage-tool',
      desc: "Returns the authenticated user's current token consumption, subscription tier, configured limit, and next reset timestamp.",
    },
    {
      name: 'decrypt-message-tool',
      desc: "Receives the full, unmodified ciphertext of the user's message. Looks up the per-chat cryptoKey from chat_metadata in MongoDB and returns the AES-decrypted plaintext to the model.",
    },
    {
      name: 'greeting-tool',
      desc: 'Example tool that returns a greeting and demonstrates streaming progress reporting via context.reportProgress().',
    },
  ];

  encryptionFlow = [
    {
      n: '1',
      title: 'Session created',
      detail: 'cryptoKey generated & stored in chat_metadata. Never leaves MongoDB.',
      circleClass: 'bg-warn-bg border-warn-border text-warn-text',
    },
    {
      n: '2',
      title: 'Encrypt',
      detail:
        'Backend runs CryptoJS.AES.encrypt() on all message content before forwarding to LM Studio.',
      circleClass: 'bg-warn-bg border-warn-border text-warn-text',
    },
    {
      n: '3',
      title: 'Prompt inject',
      detail: 'Developer-turn instruction injected: always call decrypt-message-tool first.',
      circleClass: 'bg-accent/15 border-accent/30 text-accent',
    },
    {
      n: '4',
      title: 'MCP decrypt',
      detail:
        'LM Studio calls back — decrypt-message-tool fetches key from DB and returns plaintext.',
      circleClass: 'bg-reasoning-bg border-reasoning-border text-reasoning-text',
    },
    {
      n: '5',
      title: 'Answer',
      detail: 'Model answers the decrypted question. The cycle is invisible to the end user.',
      circleClass: 'bg-success-bg border-success-border text-success-text',
    },
  ];

  securityBoundaries = [
    { what: 'cryptoKey', where: 'chat_metadata MongoDB document', plaintext: true },
    { what: 'Messages → LM Studio store', where: 'LM Studio message store', plaintext: false },
    { what: 'Browser → NestJS (HTTP body)', where: 'HTTPS in production', plaintext: true },
    { what: 'chatId MCP header', where: 'MCP request header (key lookup)', plaintext: true },
  ];

  tokenTiers = [
    {
      label: 'Free',
      tokens: 'Configurable',
      cardClass: 'bg-surface-raised border-border-default',
      labelClass: 'text-text-muted',
    },
    {
      label: 'Basic',
      tokens: 'Configurable',
      cardClass: 'bg-accent-subtle border-accent/25',
      labelClass: 'text-accent',
    },
    {
      label: 'Custom',
      tokens: 'DB-driven',
      cardClass: 'bg-reasoning-bg border-reasoning-border',
      labelClass: 'text-reasoning-text',
    },
  ];

  authItems = [
    {
      title: 'Registration',
      desc: 'POST /auth/register creates a user with a bcrypt-hashed password. New accounts are inactive until an activation link is used.',
      icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
      iconBg: 'bg-success-bg',
      iconColor: 'text-success-text',
    },
    {
      title: 'Login',
      desc: 'POST /auth/login returns a signed JWT (1-hour expiry). The Angular root component auto-redirects to /login when the token expires.',
      icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1',
      iconBg: 'bg-tool-bg',
      iconColor: 'text-tool-text',
    },
    {
      title: 'JWT Guard',
      desc: 'JwtAuthGuard is applied globally as an APP_GUARD. Individual routes are opted out with the @Public() decorator.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      iconBg: 'bg-accent/15',
      iconColor: 'text-accent',
    },
    {
      title: 'Role-Based Access',
      desc: 'RolesGuard enforces @Roles(Role.Admin) and @Roles(Role.User) decorators on individual endpoints.',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      iconBg: 'bg-reasoning-bg',
      iconColor: 'text-reasoning-text',
    },
  ];

  apiRoutes = [
    {
      method: 'POST',
      path: '/auth/register',
      desc: 'Create a new user account',
      methodClass: 'bg-success-bg text-success-text border border-success-border',
    },
    {
      method: 'POST',
      path: '/auth/login',
      desc: 'Authenticate and receive a JWT',
      methodClass: 'bg-success-bg text-success-text border border-success-border',
    },
    {
      method: 'GET',
      path: '/lm-studio/models',
      desc: 'List models available in LM Studio',
      methodClass: 'bg-tool-bg text-tool-text border border-tool-border',
    },
    {
      method: 'POST',
      path: '/lm-studio/chat',
      desc: 'Non-streaming chat (LM Studio native API)',
      methodClass: 'bg-success-bg text-success-text border border-success-border',
    },
    {
      method: 'POST',
      path: '/lm-studio/chat/stream',
      desc: 'Streaming SSE (LM Studio native API)',
      methodClass: 'bg-success-bg text-success-text border border-success-border',
    },
    {
      method: 'GET',
      path: '/openai/models',
      desc: 'List models via OpenAI SDK',
      methodClass: 'bg-tool-bg text-tool-text border border-tool-border',
    },
    {
      method: 'POST',
      path: '/openai/chat/stream',
      desc: 'Streaming SSE via OpenAI Responses API',
      methodClass: 'bg-success-bg text-success-text border border-success-border',
    },
    {
      method: 'POST',
      path: '/openai/completions/stream',
      desc: 'Streaming SSE via OpenAI Completions API',
      methodClass: 'bg-success-bg text-success-text border border-success-border',
    },
    {
      method: 'GET',
      path: '/chat-metadata',
      desc: "List the user's chat sessions",
      methodClass: 'bg-tool-bg text-tool-text border border-tool-border',
    },
    {
      method: 'POST',
      path: '/chat-metadata',
      desc: 'Create a chat session',
      methodClass: 'bg-success-bg text-success-text border border-success-border',
    },
    {
      method: 'PATCH',
      path: '/chat-metadata/:id',
      desc: 'Update a chat session',
      methodClass: 'bg-warn-bg text-warn-text border border-warn-border',
    },
    {
      method: 'DELETE',
      path: '/chat-metadata/:id',
      desc: 'Delete a chat session',
      methodClass: 'bg-error-bg text-error-text border border-error-border',
    },
    {
      method: 'GET',
      path: '/chats/:chatId',
      desc: 'Retrieve messages for a session',
      methodClass: 'bg-tool-bg text-tool-text border border-tool-border',
    },
    {
      method: 'GET',
      path: '/tools/mcp',
      desc: 'MCP server endpoint (SSE + Streamable HTTP)',
      methodClass: 'bg-tool-bg text-tool-text border border-tool-border',
    },
  ];
}
