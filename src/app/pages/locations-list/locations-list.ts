import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { LocationService } from '../../services/location.service';
import { ApiResponse } from '../../models/api-response.model';
import { Location } from '../../models/location.model';
import { failed, loaded, loading } from '../../shared/remote-data';
import { PaginatorComponent } from '../../components/paginator/paginator';
import { LoaderComponent } from '../../components/loader/loader';
import { ErrorMessageComponent } from '../../components/error-message/error-message';

@Component({
  selector: 'app-locations-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterLink, PaginatorComponent, LoaderComponent, ErrorMessageComponent],
  templateUrl: './locations-list.html',
})
export class LocationsListComponent {
  private readonly locationService = inject(LocationService);

  protected readonly page = signal(1);
  private readonly retryTrigger = signal(0);

  protected readonly vm$ = combineLatest([
    toObservable(this.page),
    toObservable(this.retryTrigger),
  ]).pipe(
    switchMap(([page]) =>
      this.locationService.getAll(page).pipe(
        map((response) => loaded<ApiResponse<Location>>(response)),
        startWith(loading<ApiResponse<Location>>()),
        catchError(() => of(failed<ApiResponse<Location>>('Erreur lors du chargement des lieux.'))),
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
