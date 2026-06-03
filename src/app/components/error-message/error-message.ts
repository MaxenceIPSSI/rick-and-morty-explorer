import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="error" role="alert">
      <p>⚠️ {{ message() }}</p>
      <button type="button" (click)="retry.emit()">Réessayer</button>
    </div>
  `,
  styles: [
    `
      .error {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 1.5rem;
        background: #fdecea;
        border: 1px solid #f5c6cb;
        border-radius: 10px;
        color: #b02a37;
      }
      button {
        padding: 0.5rem 1.1rem;
        border: none;
        border-radius: 8px;
        background: #b02a37;
        color: #fff;
        cursor: pointer;
      }
    `,
  ],
})
export class ErrorMessageComponent {
  readonly message = input<string>('Une erreur est survenue.');
  readonly retry = output<void>();
}
