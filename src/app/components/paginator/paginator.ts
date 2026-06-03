import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="paginator">
      <button type="button" [disabled]="isFirst()" (click)="prev.emit()">← Précédent</button>
      <span>Page {{ currentPage() }} / {{ totalPages() }}</span>
      <button type="button" [disabled]="isLast()" (click)="next.emit()">Suivant →</button>
    </nav>
  `,
  styles: [
    `
      .paginator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin: 1.5rem 0;
      }
      button {
        padding: 0.5rem 1rem;
        border: 1px solid #2a9d8f;
        background: #2a9d8f;
        color: #fff;
        border-radius: 8px;
        cursor: pointer;
      }
      button:disabled {
        background: #cdd6dd;
        border-color: #cdd6dd;
        cursor: not-allowed;
      }
      span {
        font-weight: 600;
        color: #34495e;
      }
    `,
  ],
})
export class PaginatorComponent {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly prev = output<void>();
  readonly next = output<void>();

  readonly isFirst = computed(() => this.currentPage() <= 1);
  readonly isLast = computed(() => this.currentPage() >= this.totalPages());
}
