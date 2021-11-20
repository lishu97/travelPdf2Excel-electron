import { useState, useCallback, useEffect } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { Upload, Button, message, Input } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import DirInput from './DirInput';
import { getBase64 } from './utils';
// import classnames from 'classNames'
import './App.css';
import 'antd/lib/message/style/index.css';
import 'antd/lib/upload/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';

declare global {
  interface Window {
    electron?: any;
  }
}

const Translator = () => {
  const [dir, setDir] = useState('');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);

  useEffect(() => {
    window.electron.ipcRenderer.on('ipc-example', (a: any) => {
      console.log(a);
      // 关闭loading，提示成功
    });
  }, []);

  const onChange = useCallback(
    ({ file }) => {
      switch (file.status) {
        case 'uploading':
          if (
            !fileList.find(
              (item) => item.originFileObj?.path === file.originFileObj.path
            )
          ) {
            setFileList((preFileList) => [...preFileList, file]);
          } else {
            message.warning(`"${file.originFileObj.name}" 已在选择列表中`);
          }
          break;
        case 'removed':
          setFileList((preFileList) =>
            preFileList.filter(
              (item) => item.originFileObj?.path !== file.originFileObj.path
            )
          );
          break;
        default:
          // eslint-disable-next-line no-console
          console.warn('不是新增、也不是删除操作', file);
          break;
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

  const onExport = useCallback(() => {
    // TODO: 采集导出路径
    Promise.all(
      fileList.map((file) => {
        return getBase64(file.originFileObj!);
      })
    ).then((filesBase64) => {
      window.electron.ipcRenderer.myPing({
        id,
        name,
        fileList: filesBase64,
      });
    });
  }, [id, name, fileList]);

  return (
    <div
      style={{
        width: 'calc(100vw - 200px)',
        minWidth: '200px',
        maxWidth: '500px',
      }}
    >
      <div className="w-full">
        <div className="mb-4">
          <div className="mb-2">导出目录：</div>
          <div className="w-full">
            <DirInput value={dir} onChange={(value: string) => setDir(value)} />
          </div>
        </div>
        <div className="mb-4">
          <div className="mb-2">工号：</div>
          <div className="w-full">
            <Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full box-border"
              placeholder="请输入工号"
            />
          </div>
        </div>
        <div className="mb-4">
          <div className="mb-2">姓名：</div>
          <div className="w-full">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full box-border"
              placeholder="请输入姓名"
            />
          </div>
        </div>
        <div className="mb-4">
          <div className="mb-2">文件：</div>
          <div className="w-full">
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
      <div className="flex justify-around">
        <Button size="large" type="primary" onClick={onExport}>
          导出
        </Button>
        <Button
          size="large"
          type="default"
          onClick={() => {
            setId('');
            setName('');
            setFileList([]);
          }}
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
        <Route path="/" component={Translator} />
      </Switch>
    </Router>
  );
}
