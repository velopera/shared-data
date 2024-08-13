import { logger } from "./logging";
import { LoginMsg, ParsedLoginData, StatusMsg } from "./velopera-data";

export abstract class MessageParser {
  status: ParsedLoginData | undefined;

  constructor(public imei: string, public scId: string) {}

  // Method to handle MQTT messages
  async handle(topic: string, payload: Buffer) {
    let messageType = topic.split("/")[2]; // "x"
    // Condition to listen which message received
    if (messageType === "status") {
      this.handleStatusPayload(payload);
      logger.debug(`Handled from ${topic}`);
    } else if (messageType === "login") {
      this.handleLoginPayload(payload);
      logger.debug(`Handled from ${topic}`);
    } else {
      // TODO: Procedures for other message types
      logger.warn(`unknown message type from topic: ${topic}`);
    }
  }

  protected handleStatusPayload(payload: Buffer): void {
    try {
      logger.debug(
        `||| Status Payload Parsed ||| \n${payload.toString("utf-8")}`
      );
      const msg = JSON.parse(payload.toString("utf-8"));

      let statusData: StatusMsg = {};

      statusData.aku_voltage = msg.aku_voltage;
      statusData.comp_x = msg.compass[0];
      statusData.comp_y = msg.compass[1];
      statusData.comp_z = msg.compass[2];
      statusData.gear = msg.gear;
      statusData.humidity = msg.humidity;
      statusData.speed = msg.speed;
      statusData.temperature = msg.temperature;

      logger.debug(
        `||| Influxing Status Data ||| \n${JSON.stringify(statusData)}`
      );

      this.handleParsedStatus(statusData);
    } catch (error) {
      logger.error(`getStatusPayload ${error}`);
    }
  }

  private handleLoginPayload(payload: Buffer): void {
    const loginData = this.parseLoginMessage(payload);
    this.handleParsedLogin(loginData);
  }

  protected parseLoginMessage(payload: Buffer): ParsedLoginData {
    let msg: LoginMsg;

    try {
      logger.debug(
        `||| Login Payload Parsed ||| \n${payload.toString("utf-8")}`
      );
      msg = JSON.parse(payload.toString("utf-8"));
    } catch (error) {
      logger.error(`error parseLoginMessage ${error}`);
      msg = {
        networkStatus: undefined,
        rsrp: undefined,
        mcc: undefined,
        mnc: undefined,
        cid: undefined,
        band: undefined,
        areaCode: undefined,
        modem: undefined,
        fw: undefined,
        iccid: undefined,
      };
    }

    return {
      networkStatus: msg.networkStatus,
      rsrp: msg.rsrp,
      mcc: this.parseHexNumber(msg.mcc),
      mnc: this.parseHexNumber(msg.mnc),
      cid: this.parseHexNumber(msg.cid),
      band: this.parseHexNumber(msg.band),
      areaCode: this.parseHexNumber(msg.areaCode),
      modem: msg.modem,
      fw: msg.fw,
      iccid: msg.iccid,
    };
  }

  private parseHexNumber(value?: string): number | undefined {
    return value ? parseInt(value, 16) : undefined;
  }

  protected abstract handleParsedStatus(data: any): void;
  protected abstract handleParsedLogin(data: any): void;
}
