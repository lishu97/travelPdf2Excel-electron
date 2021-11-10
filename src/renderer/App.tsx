import { useState, useCallback } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { Upload, Button, message, Input } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
// import classnames from 'classNames'
import './App.css';
import 'antd/lib/message/style/index.css';
import 'antd/lib/upload/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';

const Hello = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);

  const onChange = useCallback(
    ({ file }) => {
      if (
        !fileList.find(
          (item) => item.originFileObj?.path === file.originFileObj.path
        )
      ) {
        setFileList((preFileList) => [...preFileList, file]);
      } else {
        message.warning(`"${file.originFileObj.name}" 已在选择列表中`);
      }
    },
    [fileList]
  );

  const customRequest = useCallback(
    ({ file }) => {
      setFileList(
        fileList.map((item) => {
          if (file.uid === item.uid) {
            return {
              ...item,
              percent: 100,
              status: 'done',
            };
          }
          return item;
        })
      );
    },
    [fileList]
  );
  // TODO: taiwan css
  return (
    <div>
      <div className="form">
        <div className="formItem">
          <div className="label">工号：</div>
          <div className="content">
            <Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="请输入工号"
            />
          </div>
        </div>
        <div className="formItem">
          <div className="label">姓名：</div>
          <div className="content">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入姓名"
            />
          </div>
        </div>
        <div className="formItem">
          <div className="label">文件：</div>
          <div className="content">
            <Upload
              multiple
              fileList={fileList}
              customRequest={customRequest}
              onChange={onChange}
              accept=".pdf"
            >
              <Button size="small" icon={<UploadOutlined />}>
                Upload
              </Button>
            </Upload>
          </div>
        </div>
      </div>
      <div className="operation">
        <Button
          size="large"
          type="primary"
          onClick={() => console.log(fileList)}
        >
          导出
        </Button>
        <Button
          size="large"
          type="default"
          onClick={() => console.log(fileList)}
        >
          重置
        </Button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
