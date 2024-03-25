export interface ParsedLoginData {
    networkStatus?: string;
    rsrp?: number;
    mcc?: number;
    mnc?: number;
    cid?: number;
    band?: number;
    areaCode?: number;
    op?: number;
    modem?: string;
    fw?: string;
    iccid?: string;
}

export interface LoginMsg {
    status?: string;
    rsrp?: number;
    mcc?: string;
    mnc?: string;
    cid?: string;
    band?: string;
    areaCode?: string;
    op?: string;
    modem?: string;
    fw?: string;
    iccid?: string;
}

export interface statusMsg {
    speed?: number;
    gear?: number;
    aku_voltage?: string;
    temperature?: string;
    humidity?: string;
    compass?: Array<number>;
}