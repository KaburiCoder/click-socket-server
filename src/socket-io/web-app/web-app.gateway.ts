import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WebAppService } from './web-app.service';
import { UseFilters, UseInterceptors } from '@nestjs/common';
import { SocketIOInterceptor } from 'src/common/socket-io/interceptors/socket-io-interceptor';
import { SocketIOExceptionsFilter } from 'src/common/socket-io/filters/socket-io-exceptions.filter';
import { Server, Socket } from 'socket.io';
import { RoomEv } from 'src/common/socket-io/constants/room-ev';
import { ClickDaemonDto } from 'src/common/socket-io/dto/click-daemon.dto';
import { WebAppEv } from './constants/web-app-ev';

@WebSocketGateway({ transports: ['websocket'], namespace: "/web-app" })
@UseInterceptors(SocketIOInterceptor)
@UseFilters(SocketIOExceptionsFilter)
export class WebAppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly webAppService: WebAppService) { }
  handleConnection(client: any, ...args: any[]) {
    this.webAppService.connectChange(client, true);
  }

  handleDisconnect(client: any) {
    this.webAppService.connectChange(client, false);
  }

  afterInit(server: Server) {
    this.webAppService.setServer(server);
  }

  @SubscribeMessage(RoomEv.joinRoom)
  joinRoom(@MessageBody() dto: ClickDaemonDto, @ConnectedSocket() client: Socket) {
    return this.webAppService.joinRoom(client, dto);
  }

  @SubscribeMessage(WebAppEv.winAccountVerification)
  winAccountVerification(@MessageBody() dto: ClickDaemonDto) {
    return this.webAppService.brokerEvent(WebAppEv.winAccountVerification, dto);
  }

  @SubscribeMessage(WebAppEv.getPatients)
  getPatients(@MessageBody() dto: ClickDaemonDto) {
    return this.webAppService.brokerEvent(WebAppEv.getPatients, dto);
  }

  @SubscribeMessage(WebAppEv.getPrescriptions)
  getPrescriptions(@MessageBody() dto: ClickDaemonDto) {
    return this.webAppService.brokerEvent(WebAppEv.getPrescriptions, dto);
  }

  @SubscribeMessage(WebAppEv.getFirstCharts)
  getFirstCharts(@MessageBody() dto: ClickDaemonDto) {
    return this.webAppService.brokerEvent(WebAppEv.getFirstCharts, dto);
  }

  @SubscribeMessage(WebAppEv.getProgressNotes)
  getProgressNotes(@MessageBody() dto: ClickDaemonDto) {
    return this.webAppService.brokerEvent(WebAppEv.getProgressNotes, dto);
  }
}
