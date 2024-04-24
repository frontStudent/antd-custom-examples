import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Table } from "antd";
import { useDeepCompareEffect } from "ahooks";
import "./index.css";

const DataGrid = ({ data, columns, ...props }) => {
  const [dataSource, setDataSource] = useState([]);

  useDeepCompareEffect(() => {
    setDataSource(data);
  }, [data]);

  const EditableContext = React.createContext(null);

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    editRender,
    record,
    ...restProps
  }) => {
    console.log("dataIndex", dataIndex);
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
      }
    }, [editing]);

    const handleFocus = () => {
      if (!editing) setEditing(true);
      //   form.setFieldsValue({
      //     [dataIndex]: record[dataIndex],
      //   });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        const row = {
          ...record,
          ...values,
        };
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataSource(newData);
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };

    let childNode = children;

    if (editRender) {
      childNode = editRender(record, {
        save,
        editing,
      });
    }

    return (
      <td {...restProps} onClick={handleFocus}>
        {childNode}
      </td>
    );
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const _columns = columns.map((col) => {
    // if (!col.editable) {
    //   return col;
    // }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        editRender: col.editRender,
        title: col.title,
      }),
    };
  });
  return (
    <div>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={_columns}
      />
    </div>
  );
};
export default DataGrid;
