export interface RemoteData<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

export function loading<T>(): RemoteData<T> {
  return { loading: true, error: null, data: null };
}

export function loaded<T>(data: T): RemoteData<T> {
  return { loading: false, error: null, data };
}

export function failed<T>(message: string): RemoteData<T> {
  return { loading: false, error: message, data: null };
}
