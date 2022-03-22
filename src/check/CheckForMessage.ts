import { ICommand } from '../types/CommandTypes';
import { Message } from 'discord.js';
import { checkPermissions } from './permissions';
import { checkOnlyForOwner } from './CheckOnlyForOwner';
import { checkCommandTimeOut } from './CheckCommandTimeOut';

export const checkForMessage = (
  message: Message<boolean>,
  commandFile: ICommand,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logFunc: (processName: string, ...rest: any) => void,
  owner: string[],
  Timeout: {
    [key: string]: number;
  }
) => {
  if (commandFile.permission) {
    const IsHavePermission = checkPermissions(
      message.member?.permissions,
      commandFile.permission
    );
    if (!IsHavePermission) {
      logFunc(
        'OnMessageCreate',
        `${message.author.username} don't have permission to use command : '${commandFile.name}'`
      );
      return `Bạn không có quyền để sử dụng lệnh ${commandFile.name}`;
    }
  }
  if (commandFile.OnlyOwner) {
    if (!checkOnlyForOwner(owner, message.author.id)) {
      logFunc(
        'OnMessageCreate',
        `${message.author.username} don't have permission to use command : '${commandFile.name}' for owner`
      );
      return `Bạn không có quyền để sử dụng lệnh ${commandFile.name}`;
    }
  }
  if (commandFile.coolDown) {
    const commandTimeout = checkCommandTimeOut(
      commandFile,
      Timeout,
      message.author.id
    );
    if (commandTimeout) {
      logFunc(
        'OnMessageCreate',
        `${message.author.username} don't wait command Timeout : '${commandFile.name}'`
      );
      return commandTimeout;
    }
  }
  return null;
};
