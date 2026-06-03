import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loader" role="status" aria-label="Chargement">
      <span class="spinner"></span>
      <p>Chargement…</p>
    </div>
  `,
  styles: [
    `
      .loader {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 2rem;
        color: #5a6b7b;
      }
      .spinner {
        width: 42px;
        height: 42px;
        border: 4px solid #d6e4f0;
        border-top-color: #2a9d8f;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoaderComponent {}
