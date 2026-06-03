import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="not-found">
      <h1>404</h1>
      <p>Cette page s'est perdue dans une autre dimension.</p>
      <a class="btn-link" routerLink="/dashboard">Retour au dashboard</a>
    </section>
  `,
  styles: [
    `
      .not-found {
        text-align: center;
        padding: 4rem 1rem;
      }
      h1 {
        font-size: 5rem;
        margin: 0;
      }
    `,
  ],
})
export class NotFoundComponent {}
