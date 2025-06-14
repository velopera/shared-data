import { logger } from "./logging";
import { GpsMsg, LoginMsg, ParsedLoginData, StatusMsg } from "./velopera-data";

export abstract class MessageParser {
  status: ParsedLoginData | undefined;

  constructor(public imei: string, public scId: string) { }

  // Method to handle MQTT messages
  async handle(topic: string, payload: Buffer) {
    let messageType = topic.split("/")[2]; // "x"

    // Condition to listen which message received
    if (messageType === "status") {
      this.handleStatusPayload(payload);
      logger.debug(`Handled from ${topic}`);
      return;
    }

    if (messageType === "login") {
      this.handleLoginPayload(payload);
      logger.debug(`Handled from ${topic}`);
      return;
    }

    if (messageType === "gps") {
      this.handleGpsPayload(payload);
      logger.debug(`Handled from ${topic}`);
      return;
    }
  }
  protected handleGpsPayload(payload: Buffer): void {
    try {
      logger.debug(`||| GPS Payload Parsed ||| \n${payload.toString("utf-8")}`);
      const msg = JSON.parse(payload.toString("utf-8"));

      let gpsData: GpsMsg = {};

      gpsData.latitude = msg.Latitude;
      gpsData.longitude = msg.Longitude;
      gpsData.altitude = msg.Altitude;
      gpsData.accuracy = msg.Accuracy;
      gpsData.speed = msg.Speed;
      gpsData.speedAccuracy = msg.SpeedAccuracy;
      gpsData.heading = msg.Heading;
      gpsData.pdop = msg.PDOP;
      gpsData.hdop = msg.HDOP;
      gpsData.vdop = msg.VDOP;
      gpsData.tdop = msg.TDOP;
      gpsData.measId = msg.measId;

      this.handleParsedGps(gpsData);
    } catch (error) {
      logger.error(`getGpsPayload ${error}`);
    }
  }
  protected handleStatusPayload(payload: Buffer): void {
    try {
      logger.debug(`||| Status Payload Parsed ||| \n${payload.toString("utf-8")}`);
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
      logger.debug(`||| Login Payload Parsed ||| \n${payload.toString("utf-8")}`);
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
  protected abstract handleParsedGps(data: any): void;
}
