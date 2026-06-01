import { Injectable } from '@nestjs/common';
import { MessageFormatterService } from '../message-formatter/message-formatter.service';

@Injectable()
export class LoggerService {
  constructor(
    private readonly messageFormatterService: MessageFormatterService,
  ) {}

  log(message: string) {
    const formattedMessage = this.messageFormatterService.formatter(message);
    console.log(formattedMessage);
    return formattedMessage;
  }
}
