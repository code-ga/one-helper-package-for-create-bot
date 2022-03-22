import { ICommand } from '../types/CommandTypes';
import { CacheType, Interaction } from 'discord.js';
import { checkPermissions } from './permissions';
import { checkOnlyForOwner } from './CheckOnlyForOwner';
import { checkCommandTimeOut } from './CheckCommandTimeOut';

export const checkForInteraction = (
  interaction: Interaction<CacheType>,
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
      interaction.memberPermissions,
      commandFile.permission
    );
    if (!IsHavePermission) {
      logFunc(
        'OnInteractionCreate',
        `${interaction.user.username} don't have permission to use command : '${commandFile.name}'`
      );
      return `Bạn không có quyền để sử dụng lệnh ${commandFile.name}`;
    }
  }
  if (commandFile.OnlyOwner) {
    if (!checkOnlyForOwner(owner, interaction.user.id)) {
      logFunc(
        'OnInteractionCreate',
        `${interaction.user.username} don't have permission to use command : '${commandFile.name}' for owner`
      );
      return `Bạn không có quyền để sử dụng lệnh ${commandFile.name}`;
    }
  }
  if (commandFile.coolDown) {
    const commandTimeout = checkCommandTimeOut(
      commandFile,
      Timeout,
      interaction.user.id || ''
    );
    if (commandTimeout) {
      logFunc(
        'OnInteractionCreate',
        `${interaction.user.username} don't wait command Timeout : '${commandFile.name}'`
      );
      return commandTimeout;
    }
  }
  return null;
};