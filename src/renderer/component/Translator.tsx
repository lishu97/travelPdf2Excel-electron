import { useRef, useState, useCallback, useEffect } from 'react';
import { Upload, Button, message, Input } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { action } from '../../main/controller';
import { UploadOutlined } from '@ant-design/icons';
import DirInput from './DirInput';

const Translator = () => {
  const loadingKeyRef = useRef('loading');
  const [dir, setDir] = useState('');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);

  useEffect(() => {
    window.electron.ipcRenderer.on('ipc', (arg: action) => {
      switch (arg.name) {
        case 'exportEnd': {
          message.destroy(loadingKeyRef.current);
          if (arg.payload === 'success') {
            message.success('导出完成！');
          } else {
            message.error('导出失败！');
          }
        }
      }
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
    if (!dir) {
      message.warning('请选择导出目录');
      return;
    }
    if (!id) {
      message.warning('工号不能为空');
      return;
    }
    if (!name) {
      message.warning('姓名不能为空');
      return;
    }
    if (!fileList?.length) {
      message.warning('请选择文件');
      return;
    }
    message.loading({ content: '正在导出...', key: loadingKeyRef.current }, 0);
    window.electron.ipcRenderer.send({
      name: 'exportExcel',
      payload: {
        outputPath: dir,
        id,
        name,
        filePaths: fileList
          .map((file) => file?.originFileObj?.path)
          .filter(Boolean),
      },
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
            <DirInput value={dir} onChange={(dir: string) => setDir(dir)} />
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

export default Translator;
