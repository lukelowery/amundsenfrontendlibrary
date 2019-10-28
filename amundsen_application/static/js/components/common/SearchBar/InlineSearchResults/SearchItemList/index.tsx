import * as React from 'react';

import { indexUsersEnabled } from 'config/config-utils';
import { ResourceType } from 'interfaces';

import SearchItem from './SearchItem';

import * as CONSTANTS from '../constants';

export interface SearchItemListProps {
  onItemSelect: (resourceType: ResourceType) => void;
  searchTerm: string;
}

class SearchItemList extends React.Component<SearchItemListProps, {}> {
  constructor(props) {
    super(props);
  }

  getListItemText = (resourceType: ResourceType): string => {
    switch (resourceType) {
      case ResourceType.table:
        return CONSTANTS.DATASETS_ITEM_TEXT;
      case ResourceType.user:
        return CONSTANTS.PEOPLE_ITEM_TEXT;
      default:
        return '';
    }
  }

  render = () => {
    return (
      <ul className="list-group">
        <SearchItem
          listItemText={this.getListItemText(ResourceType.table)}
          onItemSelect={this.props.onItemSelect}
          searchTerm={this.props.searchTerm}
          resourceType={ResourceType.table}
        />
        {
          indexUsersEnabled() &&
          <SearchItem
            listItemText={this.getListItemText(ResourceType.user)}
            onItemSelect={this.props.onItemSelect}
            searchTerm={this.props.searchTerm}
            resourceType={ResourceType.user}
          />
        }
      </ul>
    );
  }
}

export default SearchItemList;
