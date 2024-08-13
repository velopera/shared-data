import { ParsedLoginData } from "./velopera-data";
export declare abstract class MessageParser {
    imei: string;
    scId: string;
    status: ParsedLoginData | undefined;
    constructor(imei: string, scId: string);
    handle(topic: string, payload: Buffer): Promise<void>;
    protected handleStatusPayload(payload: Buffer): void;
    private handleLoginPayload;
    protected parseLoginMessage(payload: Buffer): ParsedLoginData;
    private parseHexNumber;
    protected abstract handleParsedData(data: any): void;
}
