import { useEffect } from 'react';
import { Input, Button, message } from 'antd';

interface DirInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DirInput(props: DirInputProps) {
  useEffect(() => {
    window.electron.ipcRenderer.on('ipc', (dir: string | undefined) => {
      typeof dir === 'string' && props.onChange(dir);
    });
  }, []);

  const onBtnClick = () => {
    window.electron.ipcRenderer.send({
      name: 'openChooseDirModal',
    });
  };

  return (
    <Input.Group compact className="w-full box-border">
      <Input
        style={{ width: 'calc(100% - 90px)', height: '32px' }}
        value={props.value}
        onChange={() => message.warning('请点击 “选择目录” 按钮修改路径')}
        placeholder="请选择目录"
      />
      <Button style={{ width: '90px' }} onClick={onBtnClick}>
        选择目录
      </Button>
    </Input.Group>
  );
}
