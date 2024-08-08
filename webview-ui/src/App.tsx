import { useEffect, useState } from "react";
import { vscode } from "./vscode";
import { Card, Form, Input, Button, Modal } from "antd";
import { getInterfacesTree } from "./service";
import type { ApiListDataType, InterfaceResponse } from "./service/data.d";
import FieldsTable from "./fieldsTable";
import InterfaceTree from "./InterfaceTree";

type ConfigType = {
  projectId: string;
  projectName: string;
  projectToken: string;
};

const codeFileList: string[] = [
  "basicForm.tsx",
  "index.tsx",
  "add.tsx",
  "edit.tsx",
  "view.tsx",
  "service.ts",
  "data.d.ts",
];

function App() {
  const [form] = Form.useForm();
  const [_, setConfig] = useState<ConfigType>({} as ConfigType);
  const [treeData, setTreeData] = useState<ApiListDataType[]>([]);
  const [selectFieldsKeys, setSelectFieldsKeys] = useState<React.Key[]>([]);
  const defaultPath: string = "/src/pages";

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      console.log("message", message);
      if (message.command === "config") {
        setConfig(message.data);
        // 获取接口列表树
        getInterTree(message.data.projectId);
      }
    });
  }, []);

  const getInterTree = async (projectId: string) => {
    const res = await getInterfacesTree({ projectId });
    if (res.success) {
      const data = handleTreeData(res.data.tree);
      setTreeData(data);
    }
  };

  // 处理数据，将接口数据添加到目录下
  const handleTreeData = (lst: ApiListDataType[]) => {
    if (!lst || lst.length < 1) {
      return [];
    }
    const data = lst;
    const dg = (lt: ApiListDataType[]) => {
      lt.forEach((item: ApiListDataType) => {
        if (!item.isInterFace) {
          item.isLeaf = false;
          item.selectable = false;
        }
        if (item.children && item.children.length > 0) {
          dg(item.children as unknown as ApiListDataType[]);
        }
        if (item.interfacePrimaries && item.interfacePrimaries.length > 0) {
          const arr = [...item.interfacePrimaries].map((t) => {
            return {
              ...t,
              // 添加一个标识，用于区分是接口还是目录
              isInterFace: true,
              isLeaf: true,
              selectable: true,
            };
          });
          if (item.children && item.children.length > 0) {
            item.children.push(...arr);
          } else {
            item.children = [...arr];
          }
        }
      });
    };
    dg(data);
    return data;
  };

  // 递归设置children字段
  const setChildrenList = (data: InterfaceResponse[]): InterfaceResponse[] => {
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        item.children = setChildrenList(item.children);
      }
      return {
        ...item,
        children:
          item.children && item.children.length > 0 ? item.children : null,
      };
    });
  };

  const setFieldsList = (list: InterfaceResponse[]) => {
    const data = setChildrenList(list);
    form.setFieldsValue({ fieldsList: data });
  };

  // 递归获取选中的字段
  const getSelectionFields = (data: InterfaceResponse[]) => {
    const arr: InterfaceResponse[] = [];
    const dg = (lt: InterfaceResponse[]) => {
      lt.forEach((item) => {
        if (selectFieldsKeys.includes(item.id)) {
          arr.push(item);
        }
        if (item.children && item.children.length > 0) {
          dg(item.children);
        }
      });
    };
    dg(data);
    return arr;
  };

  const generatCode = (): void => {
    form
      .validateFields()
      .then((values) => {
        if (selectFieldsKeys.length > 0 && values.fieldsList.length > 0) {
          values.fieldsList = getSelectionFields(values.fieldsList);

          // 判断是否有path，没有则默认为 /src/pages/模块名称
          if (!values.path) {
            values.path = `${defaultPath}/${values.name}`;
          }

          values.uniqueFieldTypes = [
            ...new Set(
              values.fieldsList.map(
                (item: InterfaceResponse & { fieldSearchType: string }) =>
                  item.fieldSearchType
              )
            ),
          ];

          Modal.confirm({
            title: "生成代码",
            content: (
              <ul>
                <li>确定要生成以下文件吗？</li>
                {codeFileList.map((item) => {
                  return <li key={item}>{`${values.path}/${item}`}</li>;
                })}
              </ul>
            ),
            onOk() {
              vscode.postMessage({
                command: "generatCode",
                text: JSON.stringify(values),
              });
            },
          });
        } else {
          vscode.postMessage({
            command: "error",
            text: "请先选择字段列表",
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <div className="w-full">
      <p className="text-center text-2xl">Troy代码生成插件</p>
      <div className="w-full p-5">
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          style={{ width: "100%" }}
        >
          <Card title="请配置接口以生成代码">
            <Form.Item
              label="模块名称"
              name="name"
              rules={[{ required: true, message: "请填写模块名称" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="列表接口"
              name="apiList"
              rules={[{ required: true, message: "请选择列表接口" }]}
            >
              <InterfaceTree
                type="list"
                data={treeData}
                onSelectInterface={setFieldsList}
              />
            </Form.Item>
            <Form.Item label="字段列表" name="fieldsList">
              <FieldsTable setSelectFieldsKeys={setSelectFieldsKeys} />
            </Form.Item>
            <Form.Item
              label="新增修改"
              name="apiEdit"
              rules={[{ required: true, message: "请选择新增修改接口" }]}
            >
              <InterfaceTree type="tree" data={treeData} />
            </Form.Item>
            <Form.Item
              label="详情接口"
              name="apiDetail"
              rules={[{ required: true, message: "请选择详情接口" }]}
            >
              <InterfaceTree type="tree" data={treeData} />
            </Form.Item>
            {/* <Form.Item
              label="修改主键"
              name="editPrimaryKey"
              rules={[{ required: true, message: "请选填写修改主键" }]}
            >
              <Input />
            </Form.Item> */}
            <Form.Item
              label="生成目录"
              name="path"
              rules={[{ required: false, message: "请选填写生成目录" }]}
            >
              <Input />
            </Form.Item>
          </Card>
        </Form>
        <div className="w-[30%] m-auto">
          <Button
            type="primary"
            onClick={generatCode}
            style={{ width: "100%" }}
          >
            生成代码
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
