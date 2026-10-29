import { Controller, Sse, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventsService } from './events.service.js';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Sse('sse')
  streamEvents(@Query('topic') topic?: string): Observable<MessageEvent> {
    return this.eventsService.subscribe(topic);
  }
}

