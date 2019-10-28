import * as React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import LoadingSpinner from 'components/common/LoadingSpinner';
import SearchItemList from './SearchItemList';
import ResultItemList from './ResultItemList';

import { getDatabaseDisplayName, getDatabaseIconClass, indexUsersEnabled } from 'config/config-utils';

import { Resource, ResourceType, TableResource, UserResource } from 'interfaces';

import { GlobalState } from 'ducks/rootReducer'
import { selectInlineResult } from 'ducks/search/reducer';
import { InlineSearchSelect, SearchResults, TableSearchResults, UserSearchResults } from 'ducks/search/types';

import { updateSearchUrl } from 'utils/navigation-utils';

import './styles.scss';

import * as CONSTANTS from './constants';

export interface StateFromProps {
  isLoading: boolean;
  tables: TableSearchResults;
  users: UserSearchResults;
}

export interface DispatchFromProps {
  onSearchItemSelect: (resourceType: ResourceType, searchTerm: string) => InlineSearchSelect;
}

export interface OwnProps {
  className: string;
  onItemSelect: () => void;
  searchTerm: string;
}

export type InlineSearchResultsProps = StateFromProps & DispatchFromProps & OwnProps;

export interface SuggestedResult {
  href: string;
  iconClass: string;
  subtitle: string;
  title: string;
  type: string;
}

class InlineSearchResults extends React.Component<InlineSearchResultsProps, {}> {
  constructor(props) {
    super(props);
  }

  onSearchItemSelect = (resourceType: ResourceType) => {
    this.props.onItemSelect();
    this.props.onSearchItemSelect(resourceType, this.props.searchTerm);
    updateSearchUrl({
      term: this.props.searchTerm,
      resource: resourceType,
      index: 0,
    })
  }

  getTitleForResource = (resourceType: ResourceType): string => {
    // TODO: Consolidate fter implementing filtering. The final resourceConfig can include
    // displayNames to avoid re-defining constants 'Dataset' & 'People' across components
    switch (resourceType) {
      case ResourceType.table:
        return CONSTANTS.DATASETS;
      case ResourceType.user:
        return CONSTANTS.PEOPLE;
      default:
        return '';
    }
  };

  getTotalResultsForResource = (resourceType: ResourceType) : number => {
    switch (resourceType) {
      case ResourceType.table:
        return this.props.tables.total_results
      case ResourceType.user:
        return this.props.users.total_results;
      default:
        return 0;
    }
  };

  // TODO: not typesafe
  getResultsForResource = (resourceType: ResourceType): any => {
    switch (resourceType) {
      case ResourceType.table:
        return this.props.tables.results.slice(0, 2);
      case ResourceType.user:
        return this.props.users.results.slice(0, 2);
      default:
        return [];
    }
  };

  getSuggestedResultsForResource = (resourceType: ResourceType): SuggestedResult[] => {
    const results = this.getResultsForResource(resourceType);
    return results.map((result) => {
      return {
        href: this.getSuggestedResultHref(resourceType, result),
        iconClass: this.getSuggestedResultIconClass(resourceType, result),
        subtitle: this.getSuggestedResultSubTitle(resourceType, result),
        title: this.getSuggestedResultTitle(resourceType, result),
        type: this.getSuggestedResultType(resourceType, result)
      }
    });
  };

  getSuggestedResultHref = (resourceType: ResourceType, result: Resource): string => {
    switch (resourceType) {
      case ResourceType.table:
        const table = result as TableResource;
        return `/table_detail/${table.cluster}/${table.database}/${table.schema_name}/${table.name}`;
      case ResourceType.user:
        const user = result as UserResource;
        return `/user/${user.user_id}`;
      default:
        return '';
    }
  };

  getSuggestedResultIconClass = (resourceType: ResourceType, result: Resource): string => {
    switch (resourceType) {
      case ResourceType.table:
        const table = result as TableResource;
        return getDatabaseIconClass(table.database);
      case ResourceType.user:
        return 'icon-users';
      default:
        return '';
    }
  };

  getSuggestedResultSubTitle = (resourceType: ResourceType, result: Resource): string => {
    switch (resourceType) {
      case ResourceType.table:
        const table = result as TableResource;
        return table.description;
      case ResourceType.user:
        const user = result as UserResource;
        return user.team_name;
      default:
        return '';
    }
  };

  getSuggestedResultTitle = (resourceType: ResourceType, result: Resource): string => {
    switch (resourceType) {
      case ResourceType.table:
        const table = result as TableResource;
        return `${table.schema_name}.${table.name}`;
      case ResourceType.user:
        const user = result as UserResource;
        return user.display_name;
      default:
        return '';
    }
  };

  getSuggestedResultType = (resourceType: ResourceType, result: Resource): string => {
    switch (resourceType) {
      case ResourceType.table:
        const table = result as TableResource;
        return getDatabaseDisplayName(table.database);
      case ResourceType.user:
        return 'User';
      default:
        return '';
    }
  };

  render() {
    if (this.props.isLoading) {
      return (
        <div id="search-suggest" className='search-suggest'>
          <LoadingSpinner/>
        </div>
      );
    }
    const { className = '', onItemSelect, searchTerm } = this.props;
    return (
      <div id="search-suggest" className={`search-suggest ${className}`}>
        <div className="search-suggest-section">
          <SearchItemList
            onItemSelect={this.onSearchItemSelect}
            searchTerm={searchTerm}
          />
        </div>
        <div className="search-suggest-section">
          <ResultItemList
            onFooterSelect={this.onSearchItemSelect}
            onItemSelect={onItemSelect}
            resourceType={ResourceType.table}
            searchTerm={searchTerm}
            suggestedResults={this.getSuggestedResultsForResource(ResourceType.table)}
            totalResults={this.getTotalResultsForResource(ResourceType.table)}
            title={this.getTitleForResource(ResourceType.table)}
          />
        </div>
        {
          indexUsersEnabled() &&
          <div className="search-suggest-section">
            <ResultItemList
              onFooterSelect={this.onSearchItemSelect}
              onItemSelect={onItemSelect}
              resourceType={ResourceType.user}
              searchTerm={searchTerm}
              suggestedResults={this.getSuggestedResultsForResource(ResourceType.user)}
              totalResults={this.getTotalResultsForResource(ResourceType.user)}
              title={this.getTitleForResource(ResourceType.user)}
            />
          </div>
        }
      </div>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  return {
    isLoading: state.search.inlineResults.isLoading,
    tables: state.search.inlineResults.tables,
    users: state.search.inlineResults.users,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ onSearchItemSelect: selectInlineResult }, dispatch);
};

export default connect<StateFromProps, DispatchFromProps, OwnProps>(mapStateToProps, mapDispatchToProps)(InlineSearchResults);
