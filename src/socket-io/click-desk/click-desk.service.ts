import { Injectable } from '@nestjs/common';
import { SocketServiceBase } from 'src/common/socket-io/lib/socket-service-base';
import { LoggerService } from 'src/logger/logger.service';



@Injectable()
export class ClickDeskService extends SocketServiceBase {
  constructor(logger: LoggerService) {
    logger.setContext(ClickDeskService.name);
    super(logger);
  }
}