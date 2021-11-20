import { useEffect } from 'react';
import { Input, Button } from 'antd';



export default function DirInput(props) {
  const { value, onChange } = props;
  const [dir, setDir] = useState(value);

  useEffect(() => {
    window.electron.ipcRenderer.on('ipc', (a:unknow) => {
      console.log(a);
    });
  }, [])

  useEffect(() => {
    setDir(value);
  }, [value]);

  const onBtnClick = () => {};

  const onBlur = () => {};
  return (
    <Input.Group compact className="w-full box-border">
      <Input
        style={{ width: 'calc(100% - 90px)', height: '32px' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="请选择或输入目录"
        onBlur={onBlur}
      />
      <Button style={{ width: '90px' }}>选择目录</Button>
    </Input.Group>
  );
}
