import { GlobalState } from 'ducks/rootReducer';
import { SearchReducerState } from 'ducks/search/reducer';
import { DEFAULT_RESOURCE_TYPE, ResourceType } from 'interfaces/Resources';

export const getSearchState = (state: GlobalState): SearchReducerState => state.search;

/*
TODO: Coupling the shape of the search state and search response requires the use of
Partial to resolve errors, removing type safty of these methods. We should
restructure any logic that uses the shape of a search response interchangeably with the
search reducer state. It will allow our code to scale better with new features
*/

export const getPageIndex = (state: Partial<SearchReducerState>, resource?: ResourceType) => {
  resource = resource || state.selectedTab;
  switch(resource) {
    case ResourceType.table:
      return state.tables.page_index;
    case ResourceType.user:
      return state.users.page_index;
    case ResourceType.dashboard:
      return state.dashboards.page_index;
  };
  return 0;
};

export const autoSelectResource = (state: Partial<SearchReducerState>) => {
  if (state.tables && state.tables.total_results > 0) {
    return ResourceType.table;
  }
  if (state.users && state.users.total_results > 0) {
    return ResourceType.user
  }
  if (state.dashboards && state.dashboards.total_results > 0) {
    return ResourceType.dashboard
  }
  return DEFAULT_RESOURCE_TYPE;
};
