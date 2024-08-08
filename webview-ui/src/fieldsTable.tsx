import React, { useEffect, useState } from "react";
import { EditableProTable, ProColumns } from "@ant-design/pro-components";
import type { InterfaceResponse } from "./service/data";

interface TableResponseListType extends InterfaceResponse {
  fieldSearch: number;
  fieldSearchType: string;
  fieldRemoteSource: string;
  filedRemoteKey: string;
  filedRemoteValue: string;
  fieldRequired: number;
}

type TableProps = {
  value?: TableResponseListType[];
  onChange?: (data: TableResponseListType[]) => void;
  setSelectFieldsKeys: (keys: React.Key[]) => void;
};

const FieldsTable: React.FC<TableProps> = ({
  value,
  onChange,
  setSelectFieldsKeys,
}) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<
    readonly TableResponseListType[]
  >([]);

  useEffect(() => {
    if (value && value.length > 0) {
      setDataSource(value);
    }
  }, [value]);

  const columns: ProColumns<TableResponseListType>[] = [
    {
      title: "字段名称",
      dataIndex: "name",
      key: "name",
      editable: false,
    },
    {
      title: "字段类型",
      dataIndex: "fieldType",
      key: "fieldType",
      editable: false,
    },
    {
      title: "是否搜索",
      dataIndex: "fieldSearch",
      key: "fieldSearch",
      valueType: "switch",
      fieldProps: {
        checkedChildren: "是",
        unCheckedChildren: "否",
      },
      formItemProps: {
        getValueProps: (value) => ({ value: value === 1 }),
        getValueFromEvent: (value) => (value ? 1 : 0),
      },
    },
    {
      title: "是否必填",
      dataIndex: "fieldRequired",
      key: "fieldRequired",
      valueType: "switch",
      fieldProps: {
        checkedChildren: "是",
        unCheckedChildren: "否",
      },
      formItemProps: {
        getValueProps: (value) => ({ value: value === 1 }),
        getValueFromEvent: (value) => (value ? 1 : 0),
      },
    },
    {
      title: "搜索类型",
      dataIndex: "fieldSearchType",
      key: "fieldSearchType",
      valueType: "select",
      fieldProps: {
        options: [
          {
            label: "单行文本",
            value: "text",
          },
          {
            label: "多行文本",
            value: "textarea",
          },
          {
            label: "下拉选项",
            value: "select",
          },
          {
            label: "树形下拉选项",
            value: "treeSelect",
          },
          {
            label: "单选框",
            value: "radio",
          },
          {
            label: "多选框",
            value: "checkbox",
          },
          {
            label: "开关框",
            value: "switch",
          },
          {
            label: "日期框",
            value: "date",
          },
          {
            label: "日期时间",
            value: "dateTime",
          },
        ],
      },
    },
    {
      title: "远程数据源",
      dataIndex: "fieldRemoteSource",
      key: "fieldRemoteSource",
      valueType: "text",
    },
    {
      title: "Key",
      dataIndex: "filedRemoteKey",
      key: "filedRemoteKey",
      valueType: "text",
    },
    {
      title: "Value",
      dataIndex: "filedRemoteValue",
      key: "filedRemoteValue",
      valueType: "text",
    },
  ];

  return (
    <React.Fragment>
      <EditableProTable<TableResponseListType>
        rowKey="id"
        recordCreatorProps={false}
        rowSelection={{
          selectedRowKeys: editableKeys,
          onChange: (selectedRowKeys) => {
            setEditableRowKeys(selectedRowKeys);
            setSelectFieldsKeys(selectedRowKeys);
          },
        }}
        value={dataSource}
        columns={columns}
        editable={{
          type: "multiple",
          editableKeys,
          actionRender: (_, _config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onValuesChange: (_record, recordList) => {
            setDataSource(recordList);
            onChange && onChange(recordList);
          },
          onChange: setEditableRowKeys,
        }}
      />
    </React.Fragment>
  );
};

export default FieldsTable;
