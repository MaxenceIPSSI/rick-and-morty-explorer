import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { combineLatest, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { CharacterService } from '../../services/character.service';
import { FavorisService } from '../../services/favoris.service';
import { ApiResponse } from '../../models/api-response.model';
import { Character } from '../../models/character.model';
import { failed, loaded, loading } from '../../shared/remote-data';
import { CharacterCardComponent } from '../../components/character-card/character-card';
import { SearchBarComponent } from '../../components/search-bar/search-bar';
import { PaginatorComponent } from '../../components/paginator/paginator';
import { LoaderComponent } from '../../components/loader/loader';
import { ErrorMessageComponent } from '../../components/error-message/error-message';

@Component({
  selector: 'app-characters-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    CharacterCardComponent,
    SearchBarComponent,
    PaginatorComponent,
    LoaderComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './characters-list.html',
})
export class CharactersListComponent {
  private readonly characterService = inject(CharacterService);
  protected readonly favoris = inject(FavorisService);

  protected readonly name = signal('');
  protected readonly status = signal('');
  protected readonly page = signal(1);

  protected readonly vm$ = combineLatest([
    toObservable(this.name),
    toObservable(this.status),
    toObservable(this.page),
  ]).pipe(
    debounceTime(300),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    switchMap(([name, status, page]) =>
      this.characterService.getAll(page, name, status).pipe(
        map((response) => loaded<ApiResponse<Character>>(response)),
        startWith(loading<ApiResponse<Character>>()),
        catchError(() => of(failed<ApiResponse<Character>>('Aucun personnage trouvé ou erreur réseau.'))),
      ),
    ),
  );

  onSearch(term: string): void {
    this.page.set(1);
    this.name.set(term.trim());
  }

  onStatusChange(event: Event): void {
    this.page.set(1);
    this.status.set((event.target as HTMLSelectElement).value);
  }

  prev(): void {
    this.page.update((p) => Math.max(1, p - 1));
  }

  next(total: number): void {
    this.page.update((p) => Math.min(total, p + 1));
  }

  toggleFavori(character: Character): void {
    this.favoris.toggle(character);
  }
}
