import { Module, Global } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { EventsController } from './events.controller.js';

@Global()
@Module({
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule { }

