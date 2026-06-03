import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavorisService } from '../../services/favoris.service';
import { Character } from '../../models/character.model';
import { CharacterCardComponent } from '../../components/character-card/character-card';

@Component({
  selector: 'app-favoris',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CharacterCardComponent],
  template: `
    <section>
      <h1>Mes favoris ⭐ ({{ favoris.nombre() }})</h1>

      @if (favoris.favoris().length === 0) {
        <p class="empty">
          Aucun favori pour l'instant.
          <a routerLink="/characters">Parcourir les personnages</a>
        </p>
      } @else {
        <div class="list">
          @for (character of favoris.favoris(); track character.id) {
            <app-character-card
              [character]="character"
              [isFavori]="true"
              (toggleFavori)="toggleFavori($event)"
            />
          }
        </div>
      }
    </section>
  `,
  styles: [
    `
      .empty {
        padding: 2rem;
        text-align: center;
        color: #6b7b8a;
      }
    `,
  ],
})
export class FavorisComponent {
  protected readonly favoris = inject(FavorisService);

  toggleFavori(character: Character): void {
    this.favoris.toggle(character);
  }
}
