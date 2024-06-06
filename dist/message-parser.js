"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageParser = void 0;
const logging_1 = require("./logging");
class MessageParser {
    constructor(imei, scId) {
        this.imei = imei;
        this.scId = scId;
    }
    // Method to handle MQTT messages
    handle(topic, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let messageType = topic.split("/")[2]; // "x"
            // Condition to listen which message received
            if (messageType === "status") {
                this.handleStatusPayload(payload);
                logging_1.logger.debug(`Handled from ${topic}`);
            }
            else if (messageType === "login") {
                this.handleLoginPayload(payload);
                logging_1.logger.debug(`Handled from ${topic}`);
            }
            else {
                // TODO: Procedures for other message types
                logging_1.logger.warn(`unknown message type from topic: ${topic}`);
            }
        });
    }
    handleStatusPayload(payload) {
        try {
            logging_1.logger.debug(`||| Status Payload Parsed ||| \n${payload.toString("utf-8")}`);
            const msg = JSON.parse(payload.toString("utf-8"));
            let statusData = {};
            statusData.aku_voltage = msg.aku_voltage;
            statusData.comp_x = msg.compass[0];
            statusData.comp_y = msg.compass[1];
            statusData.comp_z = msg.compass[2];
            statusData.gear = msg.gear;
            statusData.humidity = msg.humidity;
            statusData.speed = msg.speed;
            statusData.temperature = msg.temperature;
            logging_1.logger.debug(`||| Influxing Status Data ||| \n${JSON.stringify(statusData)}`);
            this.handleParsedData(statusData);
        }
        catch (error) {
            logging_1.logger.error(`getStatusPayload ${error}`);
        }
    }
    handleLoginPayload(payload) {
        const loginData = this.parseLoginMessage(payload);
        this.handleParsedData(loginData);
    }
    parseLoginMessage(payload) {
        let msg;
        try {
            logging_1.logger.debug(`||| Login Payload Parsed ||| \n${payload.toString("utf-8")}`);
            msg = JSON.parse(payload.toString("utf-8"));
        }
        catch (error) {
            logging_1.logger.error(`error parseLoginMessage ${error}`);
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
    parseHexNumber(value) {
        return value ? parseInt(value, 16) : undefined;
    }
}
exports.MessageParser = MessageParser;
