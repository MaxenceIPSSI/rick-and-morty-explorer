import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Character } from '../../models/character.model';
import { StatusPipe } from '../../pipes/status.pipe';

@Component({
  selector: 'app-character-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, StatusPipe],
  template: `
    <article class="card">
      <a [routerLink]="['/characters', character().id]">
        <img [src]="character().image" [alt]="character().name" />
      </a>
      <div class="body">
        <h3>
          <a [routerLink]="['/characters', character().id]">{{ character().name }}</a>
        </h3>
        <p class="status">{{ character().status | status }}</p>
        <p class="species">{{ character().species }}</p>
      </div>
      <button
        type="button"
        class="fav"
        [class.active]="isFavori()"
        (click)="toggleFavori.emit(character())"
      >
        {{ isFavori() ? '⭐' : '☆' }}
      </button>
    </article>
  `,
  styles: [
    `
      .card {
        position: relative;
        background: #fff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        display: flex;
        flex-direction: column;
      }
      img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
      }
      .body {
        padding: 0.75rem 1rem 1rem;
      }
      h3 {
        margin: 0 0 0.35rem;
        font-size: 1.05rem;
      }
      h3 a {
        color: #1d3557;
        text-decoration: none;
      }
      .status {
        margin: 0;
        font-weight: 600;
      }
      .species {
        margin: 0.2rem 0 0;
        color: #6b7b8a;
        font-size: 0.9rem;
      }
      .fav {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        border: none;
        background: rgba(255, 255, 255, 0.85);
        border-radius: 50%;
        width: 36px;
        height: 36px;
        font-size: 1.2rem;
        cursor: pointer;
      }
      .fav.active {
        background: #ffe9a8;
      }
    `,
  ],
})
export class CharacterCardComponent {
  readonly character = input.required<Character>();
  readonly isFavori = input<boolean>(false);
  readonly toggleFavori = output<Character>();
}
