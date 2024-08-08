export interface interfaceCodeDataType {
  apiAdd: ApiListDataType;
  apiDetail: ApiListDataType;
  apiEdit: ApiListDataType;
  apiList: ApiListDataType;
  editPrimaryKey: string;
  fieldsList: fieldsListType[];
  name: string;
  path: string;
}
interface ApiListDataType {
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
  headers: {};
  userName: string;
  updateUserName: string;
  orders: number;
  pathStr: string;
  interfaceDesc: string;
  relevanceInterface: string;
  interfaceLink: string;
  isInterFace: boolean;
  isLeaf: boolean;
  selectable: boolean;
  interfaceUrl: string;
}

interface fieldsListType {
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
  caseValue: {};
  primaryId: string;
  fieldOptional: boolean;
  pid: string;
  parentKey: string;
  arrayFirstChild: boolean;
  children: any[];
  subjectTypeId: string;
  typeRule: string;
  fieldSearch: number;
  fieldSearchType: string;
  fieldRemoteSource: string;
  filedRemoteKey: string;
  filedRemoteValue: string;
}
