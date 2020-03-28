import Router from 'next/router'
import qs from 'qs'
import {
  collectFilterFormData,
  collectSorterFormData,
  collectPaginationFormData,
  prepareFilterForQueryString,
  prepareSortingForQueryString,
  preparePaginationForQueryString,
} from '../..'

export default async function submitProductListForms({
  aggregations = {},
  isSearch = false,
  searchPhrase = '',
  resetPagination = false,
}) {
  const count = process.env.PRODUCTS_PER_PAGE

  const filterFormData = collectFilterFormData()
  const filter = prepareFilterForQueryString(filterFormData, aggregations)

  const sorterFormData = collectSorterFormData()
  const { sortBy, order } = prepareSortingForQueryString(sorterFormData)

  const paginationFormData = collectPaginationFormData()
  const { offset } = preparePaginationForQueryString(
    paginationFormData,
    count,
    resetPagination
  )

  const seoUrl = Router.asPath.replace(/\?.*$/, '') // remove queryString
  let parameters = {
    filter,
    sortBy,
    order,
    count,
    offset,
  }

  let internalRoute = '/frontend/entry'
  if (isSearch) {
    internalRoute = '/frontend/search'
    parameters.searchPhrase = searchPhrase
  }

  const queryString = qs.stringify(parameters)

  await Router.push(
    `${internalRoute}?seoUrl=${seoUrl}&${queryString}`,
    `${seoUrl}?${queryString}`
  )
}