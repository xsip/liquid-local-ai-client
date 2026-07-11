import { Component, input } from '@angular/core';

/**
 * Subtle animated wave background — used to mark a chat as "currently
 * generating a response" in the sidebar list without needing per-row text.
 * Purely decorative: sits behind the row content via negative z-index.
 */
@Component({
  selector: 'app-wave-animation',
  standalone: true,
  imports: [],
  template: `
    <div class="wave-animation {{ class() }}">
      <svg viewBox="0 0 500 100" class="{{ svgClass() }}" preserveAspectRatio="xMidYMax meet">
        <path
          class="w1"
          d="M-8.74,71.55 C289.78,255.11 349.60,4.47 505.36,34.05 L500.00,150.00 L0.00,150.00 Z"
        />
        <path
          class="w2"
          d="M-23.42,125.83 C187.63,45.89 299.38,57.73 526.80,123.86 L500.00,150.00 L0.00,150.00 Z"
        />
        <path
          class="w3"
          d="M-23.42,125.83 C172.96,-152.44 217.55,183.06 504.22,55.77 L500.00,150.00 L0.00,150.00 Z"
        />
      </svg>
    </div>
  `,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      z-index: -1;
      overflow: hidden;
      pointer-events: none;
      border-radius: inherit;
    }

    .wave-animation {
      position: absolute;
      inset: 0;
    }

    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .w1,
    .w2,
    .w3 {
      stroke: none;
      transform: translate3d(0, 0, 0);
    }

    .w1 {
      fill: var(--color-accent);
      opacity: 0.16;
      animation: wave-move-1 6s ease-in-out infinite;
    }

    .w2 {
      fill: var(--color-accent);
      opacity: 0.1;
      animation: wave-move-2 8.5s ease-in-out infinite;
    }

    .w3 {
      fill: var(--color-accent);
      opacity: 0.08;
      animation: wave-move-3 11s ease-in-out infinite;
    }

    @keyframes wave-move-1 {
      0%,
      100% {
        transform: translateX(-40px) scaleX(1.4);
      }
      50% {
        transform: translateX(0) scaleX(1.4);
      }
    }

    @keyframes wave-move-2 {
      0%,
      100% {
        transform: translateX(-60px) scaleX(1.6);
      }
      50% {
        transform: translateX(10px) scaleX(1.6);
      }
    }

    @keyframes wave-move-3 {
      0%,
      100% {
        transform: translateX(-80px) scaleX(1.8);
      }
      50% {
        transform: translateX(20px) scaleX(1.8);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .w1,
      .w2,
      .w3 {
        animation: none;
      }
    }
  `,
})
export class WaveAnimationComponent {
  readonly class = input<string>('');
  readonly svgClass = input<string>('');
}
