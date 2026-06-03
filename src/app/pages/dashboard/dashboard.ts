import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { CharacterService } from '../../services/character.service';
import { LocationService } from '../../services/location.service';
import { EpisodeService } from '../../services/episode.service';
import { FavorisService } from '../../services/favoris.service';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  private readonly characterService = inject(CharacterService);
  private readonly locationService = inject(LocationService);
  private readonly episodeService = inject(EpisodeService);
  protected readonly favoris = inject(FavorisService);

  protected readonly totalCharacters = toSignal(
    this.characterService.getAll(1).pipe(map((r) => r.info.count)),
    { initialValue: null },
  );
  protected readonly totalLocations = toSignal(
    this.locationService.getAll(1).pipe(map((r) => r.info.count)),
    { initialValue: null },
  );
  protected readonly totalEpisodes = toSignal(
    this.episodeService.getAll(1).pipe(map((r) => r.info.count)),
    { initialValue: null },
  );

  protected readonly repartition = computed(() => {
    const stats = { alive: 0, dead: 0, unknown: 0 };
    for (const favori of this.favoris.favoris()) {
      if (favori.status === 'Alive') {
        stats.alive += 1;
      } else if (favori.status === 'Dead') {
        stats.dead += 1;
      } else {
        stats.unknown += 1;
      }
    }
    return stats;
  });
}
