import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { CharacterService } from '../../services/character.service';
import { EpisodeService } from '../../services/episode.service';
import { FavorisService } from '../../services/favoris.service';
import { Character } from '../../models/character.model';
import { Episode } from '../../models/episode.model';
import { RemoteData, failed, loaded, loading } from '../../shared/remote-data';
import { ensureArray, idFromUrl, idsFromUrls } from '../../shared/url.util';
import { StatusPipe } from '../../pipes/status.pipe';
import { LoaderComponent } from '../../components/loader/loader';
import { ErrorMessageComponent } from '../../components/error-message/error-message';

interface CharacterDetailVm {
  character: Character;
  originId: number | null;
  locationId: number | null;
  episodes: Episode[];
}

@Component({
  selector: 'app-character-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterLink, StatusPipe, LoaderComponent, ErrorMessageComponent],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.css',
})
export class CharacterDetailComponent {
  private readonly characterService = inject(CharacterService);
  private readonly episodeService = inject(EpisodeService);
  protected readonly favoris = inject(FavorisService);

  readonly id = input.required<string>();
  private readonly retryTrigger = signal(0);

  protected readonly vm$ = combineLatest([toObservable(this.id), toObservable(this.retryTrigger)]).pipe(
    switchMap(([id]) => this.load(Number(id))),
  );

  private load(id: number): Observable<RemoteData<CharacterDetailVm>> {
    return this.characterService.getById(id).pipe(
      switchMap((character) => {
        const episodeIds = idsFromUrls(character.episode);
        const episodes$ = episodeIds.length
          ? this.episodeService.getMany(episodeIds).pipe(map((res) => ensureArray(res)))
          : of<Episode[]>([]);
        return episodes$.pipe(
          map((episodes) =>
            loaded<CharacterDetailVm>({
              character,
              originId: character.origin.url ? idFromUrl(character.origin.url) : null,
              locationId: character.location.url ? idFromUrl(character.location.url) : null,
              episodes,
            }),
          ),
        );
      }),
      startWith(loading<CharacterDetailVm>()),
      catchError(() => of(failed<CharacterDetailVm>('Personnage introuvable.'))),
    );
  }

  toggleFavori(character: Character): void {
    this.favoris.toggle(character);
  }

  retry(): void {
    this.retryTrigger.update((n) => n + 1);
  }
}
