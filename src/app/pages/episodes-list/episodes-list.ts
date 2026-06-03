import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { EpisodeService } from '../../services/episode.service';
import { ApiResponse } from '../../models/api-response.model';
import { Episode } from '../../models/episode.model';
import { failed, loaded, loading } from '../../shared/remote-data';
import { PaginatorComponent } from '../../components/paginator/paginator';
import { LoaderComponent } from '../../components/loader/loader';
import { ErrorMessageComponent } from '../../components/error-message/error-message';

@Component({
  selector: 'app-episodes-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterLink, PaginatorComponent, LoaderComponent, ErrorMessageComponent],
  templateUrl: './episodes-list.html',
})
export class EpisodesListComponent {
  private readonly episodeService = inject(EpisodeService);

  protected readonly page = signal(1);
  private readonly retryTrigger = signal(0);

  protected readonly vm$ = combineLatest([
    toObservable(this.page),
    toObservable(this.retryTrigger),
  ]).pipe(
    switchMap(([page]) =>
      this.episodeService.getAll(page).pipe(
        map((response) => loaded<ApiResponse<Episode>>(response)),
        startWith(loading<ApiResponse<Episode>>()),
        catchError(() => of(failed<ApiResponse<Episode>>('Erreur lors du chargement des épisodes.'))),
      ),
    ),
  );

  prev(): void {
    this.page.update((p) => Math.max(1, p - 1));
  }

  next(total: number): void {
    this.page.update((p) => Math.min(total, p + 1));
  }

  reload(): void {
    this.retryTrigger.update((n) => n + 1);
  }
}
