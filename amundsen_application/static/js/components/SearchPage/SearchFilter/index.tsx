import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GlobalState } from 'ducks/rootReducer';

import RadioItem from 'components/common/Inputs/RadioItem';

import './styles.scss'

interface SearchFilterInput {
  value: string;
  labelText: string;
  checked: boolean;
  count?: number;
}

interface SearchFilterSection {
  title: string;
  categoryId: string;
  inputProperties: SearchFilterInput[];
}

export interface StateFromProps {
  radioSections: SearchFilterSection[];
}

/*
  TODO: onFilterChange dispatched action to update filters. Consider:
  1. Payload could contain categoryId and valueId and what to do with it
     e.g. - {categoryId: 'datasets', value: 'hive', checked: false }
  2. Disable component until implementing for user friendly debouncing
  3. On success - Re-enable, checkedUI should update based on new state
  4. On failure - Re-enable, state will not have been updated on failure,
                  checkedUI stays the same.
*/
export interface DispatchFromProps {
  onFilterChange: () => any;
}

export type SearchFilterProps = StateFromProps & DispatchFromProps;

export class SearchFilter extends React.Component<SearchFilterProps> {
  constructor(props) {
    super(props);
  }

  createRadioItem = (item: SearchFilterInput, categoryId: string, key: string) => {
    const dummyMethod = () => { console.log('Dispatched') };
    const { checked, count, labelText, value } = item;
    return (
      <RadioItem
        key={key}
        checked={ checked }
        disabled={ count === 0 }
        name={ categoryId }
        value={ value }
        onChange={ dummyMethod }>
          <span className="subtitle-2">{ labelText }</span>
          {
            (count !== null || count !== undefined) &&
            <span className="body-secondary-3 pull-right">{ count }</span>
          }
      </RadioItem>
    );
  };

  createRadioSection = (section: SearchFilterSection, key: string) => {
    const { categoryId, inputProperties, title } = section;
    return (
      <div key={key} className="search-filter-section">
        <div className="title-2">{ title }</div>
        { inputProperties.map((item, index) => this.createRadioItem(item, categoryId, `item:${categoryId}:${index}`)) }
      </div>
    );
  };

  render = () => {
    return this.props.radioSections.map((section, index) => this.createRadioSection(section, `section:${index}`));
  };
};

export const mapStateToProps = (state: GlobalState) => {
  return {
    radioSections: [
      {
        title: 'Type', // category.displayName
        categoryId: 'datasets', // category.id
        inputProperties: [
          {
            value: 'all', // value.id
            labelText: 'All', // value.displayName
            checked: true, // pull value or infer value from state
            count: 100, // pull value from state
          },
          {
            value: 'bigquery', // value.id
            labelText: 'BigQuery', // value.displayName
            checked: false, // pull value or infer value from state
            count: 100, // pull value from state
          },
          {
            value: 'hive', // value.id
            labelText: 'Hive', // value.displayName
            checked: false, // pull value or infer value from state
            count: 100, // pull value from state
          },
          {
            value: 'postgres', // value.id
            labelText: 'Postgres', // value.displayName
            checked: false, // pull value or infer value from state
            count: 0, // pull value from state
          },
          {
            value: 'redshift', // value.id
            labelText: 'Redshift', // value.displayName
            checked: false, // pull value or infer value from state
          }
        ]
      }
    ]
  };
};

/*
  TODO: Dispatch a real action
*/
export const mapDispatchToProps = (dispatch: any) => {
  // return bindActionCreators({ onFilterChange } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps)(SearchFilter);
