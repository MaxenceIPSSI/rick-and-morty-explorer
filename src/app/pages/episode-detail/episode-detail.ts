import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { EpisodeService } from '../../services/episode.service';
import { CharacterService } from '../../services/character.service';
import { Episode } from '../../models/episode.model';
import { Character } from '../../models/character.model';
import { RemoteData, failed, loaded, loading } from '../../shared/remote-data';
import { ensureArray, idsFromUrls } from '../../shared/url.util';
import { StatusPipe } from '../../pipes/status.pipe';
import { LoaderComponent } from '../../components/loader/loader';
import { ErrorMessageComponent } from '../../components/error-message/error-message';

interface EpisodeDetailVm {
  episode: Episode;
  characters: Character[];
}

@Component({
  selector: 'app-episode-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterLink, StatusPipe, LoaderComponent, ErrorMessageComponent],
  templateUrl: './episode-detail.html',
  styleUrl: './episode-detail.css',
})
export class EpisodeDetailComponent {
  private readonly episodeService = inject(EpisodeService);
  private readonly characterService = inject(CharacterService);

  readonly id = input.required<string>();
  private readonly retryTrigger = signal(0);

  protected readonly vm$ = combineLatest([toObservable(this.id), toObservable(this.retryTrigger)]).pipe(
    switchMap(([id]) => this.load(Number(id))),
  );

  private load(id: number): Observable<RemoteData<EpisodeDetailVm>> {
    return this.episodeService.getById(id).pipe(
      switchMap((episode) => {
        const characterIds = idsFromUrls(episode.characters);
        const characters$ = characterIds.length
          ? this.characterService.getMany(characterIds).pipe(map((res) => ensureArray(res)))
          : of<Character[]>([]);
        return characters$.pipe(map((characters) => loaded<EpisodeDetailVm>({ episode, characters })));
      }),
      startWith(loading<EpisodeDetailVm>()),
      catchError(() => of(failed<EpisodeDetailVm>('Épisode introuvable.'))),
    );
  }

  retry(): void {
    this.retryTrigger.update((n) => n + 1);
  }
}
