import * as React from 'react';
import { connect } from 'react-redux';

import 'components/common/Inputs/styles.scss';

export interface RadioItemProps {
  checked: boolean;
  disabled?: boolean
  name: string;
  onChange: (e: React.FormEvent<HTMLInputElement>) => any;
  value: string;
}

const RadioItem: React.SFC<RadioItemProps> = ({ checked, disabled = false, name, onChange, value, children }) => {
  return (
    <div className="radio">
      <label className="radio-label">
        <input
          type="radio"
          checked={ checked }
          disabled={ disabled }
          name={ name }
          onChange={ onChange }
          value={ value }
        />
        { children }
      </label>
    </div>
  );
};

export default RadioItem;
