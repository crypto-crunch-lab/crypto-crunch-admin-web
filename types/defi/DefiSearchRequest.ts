import { DefiSearchFilters } from './DefiSearchFilters'
import { DefiSearchSorts } from './DefiSearchSorts'

export interface DefiSearchRequest {
  searchKeyword?: string
  size: number
  sorts: DefiSearchSorts
  filters: DefiSearchFilters
}
