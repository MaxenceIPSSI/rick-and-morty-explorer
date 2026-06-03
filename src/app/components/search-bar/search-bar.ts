import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      type="search"
      class="search-bar"
      placeholder="Rechercher un personnage…"
      (input)="onInput($event)"
    />
  `,
  styles: [
    `
      .search-bar {
        width: 100%;
        padding: 0.7rem 1rem;
        border: 1px solid #cdd6dd;
        border-radius: 10px;
        font-size: 1rem;
      }
      .search-bar:focus {
        outline: none;
        border-color: #2a9d8f;
      }
    `,
  ],
})
export class SearchBarComponent {
  readonly search = output<string>();

  onInput(event: Event): void {
    this.search.emit((event.target as HTMLInputElement).value);
  }
}
