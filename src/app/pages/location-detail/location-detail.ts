import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { LocationService } from '../../services/location.service';
import { CharacterService } from '../../services/character.service';
import { Location } from '../../models/location.model';
import { Character } from '../../models/character.model';
import { RemoteData, failed, loaded, loading } from '../../shared/remote-data';
import { ensureArray, idsFromUrls } from '../../shared/url.util';
import { StatusPipe } from '../../pipes/status.pipe';
import { LoaderComponent } from '../../components/loader/loader';
import { ErrorMessageComponent } from '../../components/error-message/error-message';

interface LocationDetailVm {
  location: Location;
  residents: Character[];
}

@Component({
  selector: 'app-location-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterLink, StatusPipe, LoaderComponent, ErrorMessageComponent],
  templateUrl: './location-detail.html',
  styleUrl: './location-detail.css',
})
export class LocationDetailComponent {
  private readonly locationService = inject(LocationService);
  private readonly characterService = inject(CharacterService);

  readonly id = input.required<string>();
  private readonly retryTrigger = signal(0);

  protected readonly vm$ = combineLatest([toObservable(this.id), toObservable(this.retryTrigger)]).pipe(
    switchMap(([id]) => this.load(Number(id))),
  );

  private load(id: number): Observable<RemoteData<LocationDetailVm>> {
    return this.locationService.getById(id).pipe(
      switchMap((location) => {
        const residentIds = idsFromUrls(location.residents);
        const residents$ = residentIds.length
          ? this.characterService.getMany(residentIds).pipe(map((res) => ensureArray(res)))
          : of<Character[]>([]);
        return residents$.pipe(map((residents) => loaded<LocationDetailVm>({ location, residents })));
      }),
      startWith(loading<LocationDetailVm>()),
      catchError(() => of(failed<LocationDetailVm>('Lieu introuvable.'))),
    );
  }

  retry(): void {
    this.retryTrigger.update((n) => n + 1);
  }
}
