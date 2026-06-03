import { Injectable, computed, inject, signal } from '@angular/core';
import { Character } from '../models/character.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'favoris';

@Injectable({ providedIn: 'root' })
export class FavorisService {
  private readonly storage = inject(StorageService);

  readonly favoris = signal<Character[]>(this.storage.get<Character[]>(STORAGE_KEY) ?? []);
  readonly nombre = computed(() => this.favoris().length);

  toggle(c: Character): void {
    const current = this.favoris();
    const exists = current.some((f) => f.id === c.id);
    const next = exists ? current.filter((f) => f.id !== c.id) : [...current, c];
    this.favoris.set(next);
    this.storage.set(STORAGE_KEY, next);
  }

  isFavori(id: number): boolean {
    return this.favoris().some((f) => f.id === id);
  }
}
