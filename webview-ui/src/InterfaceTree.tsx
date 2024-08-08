import React from "react";
import { TreeSelect } from "antd";
import type {
  ApiListDataType,
  InterfaceDetailType,
  InterfaceResponse,
} from "./service/data.d";
import type { TreeNodeProps } from "antd";
import { getInterfaceDetail } from "./service";

type InterfaceTreeProps = {
  value?: string;
  onChange?: (value: ApiListDataType & { interfaceUrl: string }) => void;
  onSelectInterface?: (list: InterfaceResponse[]) => void;
  type: "list" | "tree";
  data: ApiListDataType[];
};

const InterfaceTree: React.FC<InterfaceTreeProps> = ({
  onChange,
  onSelectInterface,
  data,
  type,
}) => {
  // 获取接口详情
  const getInterfaceDetails = async (
    interfaceId: string
  ): Promise<InterfaceDetailType> => {
    const res = await getInterfaceDetail({ id: interfaceId });
    return res.data;
  };

  const getFieldsDataList = (
    data: InterfaceResponse[]
  ): InterfaceResponse[] => {
    return data.filter((res) => res.name === "data");
  };

  const setFieldsDataChildrenList = (
    data: InterfaceResponse[]
  ): InterfaceResponse[] => {
    return data.map((t) => {
      if (t.children && t.children.length > 0) {
        t.children = setFieldsDataChildrenList(t.children);
      }
      return {
        ...t,
        fieldSearch: 0,
        fieldRequired: 0,
        fieldSearchType: "text",
        fieldRemoteSource: "",
        filedRemoteKey: "",
        filedRemoteValue: "",
      };
    });
  };

  const onChangeInterface = async (
    _: ApiListDataType,
    node: ApiListDataType
  ) => {
    const list = await getInterfaceDetails(node.id);
    if (type === "list") {
      let responseList;
      if (getFieldsDataList(list.interfaceResponses).length === 1) {
        responseList = getFieldsDataList(list.interfaceResponses);
      } else if (
        list.interfaceResponses.length === 1 &&
        list.interfaceResponses[0].fieldType === "object"
      ) {
        responseList = getFieldsDataList(
          list.interfaceResponses[0].children || []
        );
      }

      onSelectInterface &&
        onSelectInterface(
          setFieldsDataChildrenList(responseList?.[0].children || [])
        );
    }
    onChange && onChange({ ...node, interfaceUrl: list.url });
  };

  return (
    <TreeSelect
      showSearch
      placeholder="请选择列表接口"
      treeData={data}
      onSelect={onChangeInterface}
      filterTreeNode={(
        inputValue: string,
        treeNode: TreeNodeProps["TreeNode"]
      ) => {
        return treeNode.name.indexOf(inputValue) > -1;
      }}
      treeTitleRender={(nodeData: ApiListDataType) => {
        return (
          <div className="flex align-center justify-start">
            {nodeData.isInterFace ? (
              <>
                <span
                  className={`w-[40px] h-[22px] leading-[22px] text-sm rounded mr-2 text-center text-white ${
                    nodeData.requestType === "POST"
                      ? "bg-orange-500"
                      : "bg-[#4caf50]"
                  }`}
                >
                  {nodeData.requestType}
                </span>
                <span className="text-white">{nodeData.name}</span>
              </>
            ) : (
              <span>{nodeData.name}</span>
            )}
          </div>
        );
      }}
      fieldNames={{
        label: "name",
        value: "id",
        children: "children",
      }}
    />
  );
};

export default InterfaceTree;
