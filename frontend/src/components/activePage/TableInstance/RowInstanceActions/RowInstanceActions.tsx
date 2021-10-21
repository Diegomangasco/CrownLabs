import { FC, useState } from 'react';
import { Modal, Space, Typography } from 'antd';
import Button from 'antd-button-color';
import { Instance } from '../../../../utils';
import RowInstanceActionsPersistent from './RowInstanceActionsPersistent';
import RowInstanceActionsDropdown from './RowInstanceActionsDropdown';
import RowInstanceActionsExtended from './RowInstanceActionsExtended';
import SSHModalContent, { ISSHInfo } from '../SSHModalContent/SSHModalContent';
import RowInstanceActionsDefault from './RowInstanceActionsDefault';

const { Text } = Typography;
export interface IRowInstanceActionsProps {
  instance: Instance;
  now: Date;
  fileManager?: boolean;
  ssh?: ISSHInfo;
  extended: boolean;
  startInstance?: (idInstance: number, idTemplate: string) => void;
  stopInstance?: (idInstance: number, idTemplate: string) => void;
  destroyInstance: (idInstance: number, idTemplate: string) => void;
}

const RowInstanceActions: FC<IRowInstanceActionsProps> = ({ ...props }) => {
  const {
    instance,
    now,
    fileManager,
    ssh,
    extended,
    startInstance,
    stopInstance,
    destroyInstance,
  } = props;

  const { ip, status, persistent, idTemplate } = instance;

  const [sshModal, setSshModal] = useState(false);

  const getTime = () => {
    const timeStamp = new Date(instance.timeStamp!);
    // Get Delta time
    let delta = (now.getTime() - timeStamp.getTime()) / 1000;
    // Get Years
    const years = Math.floor(delta / (86400 * 365));
    // Get Days
    delta -= years * (86400 * 365);
    const days = Math.floor(delta / 86400);
    // Get hours
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    // Get Minutes
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;

    if (years !== 0) {
      return years + 'y ' + days + 'd';
    } else if (days !== 0) {
      return days + 'd ' + hours + 'h';
    } else if (hours !== 0) {
      return hours + 'h ' + minutes + 'm';
    } else if (minutes !== 0) {
      return minutes + 'm';
    } else return '< 1m';
  };

  return (
    <>
      <div
        className={`w-full flex items-center ${
          extended ? 'justify-end md:justify-between' : 'justify-end'
        }`}
      >
        {extended && (
          <div className="flex justify-between items-center md:w-1/3 xl:w-1/2">
            <RowInstanceActionsExtended
              ssh={ssh}
              setSshModal={setSshModal}
              ip={ip}
              time={getTime()}
              status={status}
              fileManager={fileManager}
            />
            <Space size={'middle'} className="hidden lg:block">
              <Text strong>{getTime()}</Text>
            </Space>
          </div>
        )}
        <div
          className={`flex justify-end items-center gap-2 w-100 md:w-2/3 xl:w-1/2 ${
            extended ? 'pr-2' : ''
          }`}
        >
          {persistent && startInstance && stopInstance && (
            <RowInstanceActionsPersistent
              instance={instance}
              extended={extended}
              startInstance={startInstance}
              stopInstance={stopInstance}
            />
          )}
          <RowInstanceActionsDefault
            extended={extended}
            idTemplate={idTemplate!}
            instance={instance}
            destroyInstance={destroyInstance}
          />
          <RowInstanceActionsDropdown
            instance={instance}
            ssh={ssh}
            setSshModal={setSshModal}
            fileManager={fileManager}
            extended={extended}
            startInstance={startInstance}
            stopInstance={stopInstance}
            destroyInstance={destroyInstance}
          />
        </div>
      </div>
      {ssh && (
        <Modal
          title="SSH Connection"
          visible={sshModal}
          onOk={() => setSshModal(false)}
          onCancel={() => setSshModal(false)}
          footer={[
            <Button type="primary">Set KEY</Button>,
            <Button onClick={() => setSshModal(false)}>Close</Button>,
          ]}
          centered
        >
          <SSHModalContent sshInfo={ssh} />
        </Modal>
      )}
    </>
  );
};

export default RowInstanceActions;