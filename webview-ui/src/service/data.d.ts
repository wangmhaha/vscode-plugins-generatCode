export interface IResData<T> {
  code: number;
  success: boolean;
  data: T;
  msg: string;
}

export interface IResListData<T> {
  records: T;
  total: number;
  size: number;
  current: number;
  pages: number;
  searchCount: boolean;
  hitCount: boolean;
}

export interface ApiListDataType {
  id: string;
  createUser: number;
  createDept: number;
  createTime: string;
  updateUser: number;
  updateTime: string;
  status: number;
  isDeleted: number;
  name: string;
  pid: number;
  sorted: number;
  projectId: number;
  pathStr: string;
  children: childListType[];
  interfacePrimaries: InterfacePrimary[];
  interfaceNumber: number;
  isInterFace?: boolean;
  requestType?: string;
  isLeaf: boolean;
  selectable: boolean;
}

interface childListType {
  id: string;
  createUser: number;
  createDept: number;
  createTime: string;
  updateUser: number;
  updateTime: string;
  status: number;
  isDeleted: number;
  name: string;
  projectId: number;
  itemId: number;
  url: string;
  requestType: string;
  headerData: string;
  bodyData: string;
  bodyType: string;
  reponseData: string;
  paramsData: string;
  publicHeaders: any[];
  headers: Headers;
  userName: string;
  updateUserName: string;
  orders: number;
  pathStr: string;
  interfaceDesc: string;
  relevanceInterface: string;
  interfaceLink: string;
}

interface InterfacePrimary {
  id: string;
  createUser: number;
  createDept: number;
  createTime: string;
  updateUser: number;
  updateTime: string;
  status: number;
  isDeleted: number;
  name: string;
  projectId: number;
  itemId: number;
  url: string;
  requestType: string;
  headerData: string;
  bodyData: string;
  bodyType: string;
  reponseData: string;
  paramsData: string;
  publicHeaders: any[];
  headers: Headers;
  userName: string;
  updateUserName: string;
  orders: number;
  pathStr: string;
  interfaceDesc: string;
  relevanceInterface: string;
  interfaceLink: string;
}

// 接口详情类型
export interface InterfaceDetailType {
  id: string;
  createUser: string;
  createDept: string;
  createTime: string;
  updateUser: string;
  updateTime: string;
  status: number;
  isDeleted: number;
  name: string;
  projectId: string;
  itemId: string;
  url: string;
  requestType: string;
  headerData: string;
  bodyData: string;
  bodyType: string;
  reponseData: string;
  paramsData: string;
  publicHeaders: any[];
  headers: Headers;
  userName: string;
  updateUserName: string;
  orders: number;
  pathStr: string;
  interfaceDesc: string;
  relevanceInterface: string;
  interfaceLink: string;
  interfaceHeaders: any[];
  interfaceRequests: InterfaceRequest[];
  interfaceResponses: InterfaceResponse[];
  caseList: any[];
  interfaceStatus: string;
  interfacePath: string;
}

export interface InterfaceResponse {
  id: string;
  createUser: number;
  createDept: number;
  createTime: string;
  updateUser: number;
  updateTime: string;
  status: number;
  isDeleted: number;
  name: string;
  note: string;
  fieldLength: string;
  fieldPrice: string;
  fieldType: string;
  sorted: number;
  caseValue: Headers;
  primaryId: string;
  fieldOptional: boolean;
  pid: number;
  parentKey: string;
  arrayFirstChild: boolean;
  children: InterfaceResponse[] | null;
  subjectTypeId: string;
  typeRule: string;
}

interface InterfaceRequest {
  id: string;
  createUser: number;
  createDept: number;
  createTime: string;
  updateUser: number;
  updateTime: string;
  status: number;
  isDeleted: number;
  name: string;
  note: string;
  fieldLength: string;
  fieldPrice: string;
  fieldType: string;
  sorted: number;
  caseValue: Headers;
  primaryId: string;
  fieldPrecision: string;
  requestParameterType: string;
  fieldOptional: boolean;
  pid: number;
  children: any[];
  subjectTypeId: string;
}

interface Headers {}
