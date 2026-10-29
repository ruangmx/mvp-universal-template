import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface AppEvent<TPayload = unknown> {
  topic: string;
  payload: TPayload;
  timestamp: string;
}

@Injectable()
export class EventsService {
  private events$ = new Subject<AppEvent>();

  publish<TPayload>(topic: string, payload: TPayload): void {
    this.events$.next({
      topic,
      payload,
      timestamp: new Date().toISOString(),
    });
  }

  subscribe(topic?: string): Observable<MessageEvent> {
    return this.events$.pipe(
      filter((event) => !topic || event.topic === topic),
      map(
        (event) =>
          ({
            data: JSON.stringify(event),
          }) as MessageEvent
      )
    );
  }
}

