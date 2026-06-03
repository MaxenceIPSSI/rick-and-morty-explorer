import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { Character } from '../models/character.model';
import { GET_CHARACTERS } from '../graphql/graphql';

interface GqlLink {
  id: string | null;
  name: string;
}

interface GqlCharacter {
  id: string;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: GqlLink | null;
  location: GqlLink | null;
  episode: { id: string }[];
}

const API_BASE = 'https://rickandmortyapi.com/api';

function toLink(link: GqlLink | null, resource: 'location'): { name: string; url: string } {
  if (!link || !link.id) {
    return { name: link?.name ?? 'unknown', url: '' };
  }
  return { name: link.name, url: `${API_BASE}/${resource}/${link.id}` };
}

interface GetCharactersResult {
  characters: {
    info: { count: number; pages: number; next: string | null; prev: string | null };
    results: GqlCharacter[];
  };
}

@Injectable({ providedIn: 'root' })
export class CharacterGraphqlService {
  private readonly apollo = inject(Apollo);

  getAll(page: number, name?: string, status?: string): Observable<ApiResponse<Character>> {
    return this.apollo
      .watchQuery<GetCharactersResult>({
        query: GET_CHARACTERS,
        variables: { page, name: name || null, status: status || null },
      })
      .valueChanges.pipe(
        map((result) => result.data?.characters as GetCharactersResult['characters'] | undefined),
        filter((characters): characters is GetCharactersResult['characters'] => !!characters),
        map((characters) => ({
          info: characters.info,
          results: characters.results.map((c) => this.toCharacter(c)),
        })),
      );
  }

  private toCharacter(c: GqlCharacter): Character {
    return {
      id: Number(c.id),
      name: c.name,
      status: c.status,
      species: c.species,
      type: c.type,
      gender: c.gender,
      image: c.image,
      origin: toLink(c.origin, 'location'),
      location: toLink(c.location, 'location'),
      episode: c.episode.map((e) => `${API_BASE}/episode/${e.id}`),
      url: `${API_BASE}/character/${c.id}`,
    };
  }
}
