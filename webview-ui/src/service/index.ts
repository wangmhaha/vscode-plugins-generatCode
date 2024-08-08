import request from "../utils/request";
import type { IResData, ApiListDataType, InterfaceDetailType } from "./data.d";

// 获取项目接口列表
export async function getInterfacesTree(params: { projectId: string }) {
  return request<
    IResData<{
      tree: ApiListDataType[];
      interface: any[];
    }>
  >("/api/dmp-test/tatInterfaceItem/tree", {
    method: "GET",
    params,
  });
}

// 获取项目接口详情
export async function getInterfaceDetail(params: { id: string }) {
  return request<IResData<InterfaceDetailType>>(
    "/api/dmp-test/tatInterfacePrimary/detail",
    {
      method: "GET",
      params,
    }
  );
}
