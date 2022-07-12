import { ISubCommand } from '../../../src';
import { MetaData } from '../../types/MetaDataType';

export default {
  name: 'subtraction',
  description: 'subtraction',
  callBack: (input) => {
    return {
      data:
        input.type == 'interaction'
          ? input.interaction.options.getInteger('first_num', true) -
            input.interaction.options.getInteger('second_num', true)
          : 0,
    };
  },
} as ISubCommand<MetaData>;
