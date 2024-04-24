import React from "react";
import DataGrid from "./components/DataGrid";
import { Form, Input } from "antd";
const data = [
  {
    key: "0",
    name: "Edward King 0",
    age: "32",
    address: "London, Park Lane no. 0",
  },
  {
    key: "1",
    name: "Edward King 1",
    age: "32",
    address: "London, Park Lane no. 1",
  },
];

const App = () => {
  const columns = [
    {
      title: "name",
      dataIndex: "name",
      width: "30%",
      editRender: (record, { editing, save }) => {
        console.log(editing, 'editing')
        return editing ? (
          <Form.Item
            style={{
              margin: 0,
            }}
            name={'name'}
            rules={[
              {
                required: true,
                message: `xxx is required.`,
              },
            ]}
          >
            <Input onPressEnter={save} onBlur={save} />
          </Form.Item>
        ) : (
          <div
            className="editable-cell-value-wrap"
            style={{
              paddingRight: 24,
            }}
          >
            {record?.["name"]}
          </div>
        );
      },
    },
    {
      title: "age",
      dataIndex: "age",
    },
    {
      title: "address",
      dataIndex: "address",
    },
  ];

  return <DataGrid data={data} columns={columns} />;
};
export default App;
