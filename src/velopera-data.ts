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
