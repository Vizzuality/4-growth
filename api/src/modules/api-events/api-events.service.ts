import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiEventEntity } from '@shared/dto/api-events/api-events.entity';
import { API_EVENT_TYPES } from '@shared/dto/api-events/api-event.types';

/**
 * @description: At some point we might need to extend this to use events to decouple the event creation from the logic.
 *               it might be useful to create custom decorators for methods to fire events instead of calling this service directly in each method.
 *               this will also allow us to split event types but it will also increase complexity. i.e we could have a handler/service for each event group
 */

@Injectable()
export class ApiEventsService {
  public eventMap = {
    USER_EVENTS: {
      USER_SIGNED_UP: API_EVENT_TYPES.USER_SIGNED_UP,
      USER_REQUESTED_PASSWORD_RECOVERY:
        API_EVENT_TYPES.USER_REQUESTED_PASSWORD_RECOVERY,
      USER_RECOVERED_PASSWORD: API_EVENT_TYPES.USER_RECOVERED_PASSWORD,
      USER_NOT_FOUND_FOR_PASSWORD_RECOVERY:
        API_EVENT_TYPES.USER_NOT_FOUND_FOR_PASSWORD_RECOVERY,
    },
  };
  constructor(
    @InjectRepository(ApiEventEntity)
    readonly eventRepo: Repository<ApiEventEntity>,
  ) {}

  async saveEvent(event: ApiEventEntity): Promise<void> {
    await this.eventRepo.insert(event);
  }

  async createEvent(
    type: API_EVENT_TYPES,
    payload: { associatedId?: string; data?: Record<string, unknown> },
  ): Promise<void> {
    const { associatedId, data } = payload;
    const event = new ApiEventEntity();
    event.type = type;
    event.associatedId = associatedId;
    event.data = data;
    await this.saveEvent(event);
  }
}
