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
  networkStatus?: string;
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

export interface StatusMsg {
  speed?: number;
  gear?: number;
  aku_voltage?: number;
  temperature?: number;
  humidity?: number;
  comp_x?: number;
  comp_y?: number;
  comp_z?: number;
}

export interface GpsMsg {
  latitude?: number;
  longtitude?: number;
  altitude?: number;
  accuracy?: number;
  speed?: number;
  speedAccuracy?: number;
  heading?: number;
  date?: string;
  time?: string;
  pdop?: number;
  hdop?: number;
  vdop?: number;
  tdop?: number;
  measId?: number;
}