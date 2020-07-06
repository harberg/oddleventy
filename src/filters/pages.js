'use strict';

const _ = require('lodash');

const { now, getDate } = require('#/time');

/* @docs
label: Page Filters
category: File
*/

/* @docs
label: isPublic
category: Status
note: Check that a page is
params:
  page:
    type: 11ty page object
*/
const isPublic = (page) => {
  const live = !page.data.draft;
  const title = Boolean(page.data.title);
  return live && title;
};

/* @docs
label: isCurrent
category: Status
note: Check that the page does not have an end date
params:
  page:
    type: 11ty page object
*/
const isCurrent = (page) => {
  /* istanbul ignore if */
  if (!page || !page.data) {
    return false;
  }

  return (
    page.data.end === 'ongoing' ||
    !page.data.end ||
    getDate(page.data.end) >= now()
  );
};

/* @docs
label: getCurrent
category: Filter
note: Filter to pages that do not have an end date
params:
  collection:
    type: array
    note: containing 11ty page objects
*/
const getCurrent = (collection) => collection.filter(isCurrent);

/* @docs
label: getPublic
category: Filter
note: Return only the public pages from a collection
params:
  collection:
    type: array
    note: containing 11ty page objects
*/
const getPublic = (collection) => collection.filter(isPublic);

/* @docs
label: hasData
category: Filter
note: Return true if a an object (often a page) has particular data
params:
  obj:
    type: object
    note: The object to search for data
  keys:
    type: string
    note: Any nested data attributes to get
  value:
    type: any
    note: Only approve pages where the desired attributes have a given value
  exact:
    type: boolean
    note: Force an exact match, rather than inclusion
*/
const hasData = (obj, keys, value, exact = false) => {
  if (value) {
    return exact
      ? _(obj).get(keys, '') === value
      : _(obj).get(keys, []).includes(value);
  }

  return _.hasIn(obj, keys);
};

/* @docs
label: withData
category: Filter
note: Return pages with particular data
params:
  collection:
    type: array
    note: containing 11ty page objects
  keys:
    type: string
    note: Any nested data attributes to get
  value:
    type: any
    note: Only get pages where the desired attributes have this value
  exact:
    type: boolean
    note: Force an exact match, rather than inclusion
*/
const withData = (collection, keys, value, exact = false) =>
  collection.filter((page) => hasData(page, keys, value, exact));

/* @docs
label: removePage
category: Filter
note: |
  Remove any one page from a collection
  (especially for removing tag index pages from their own resource list)
params:
  collection:
    type: array
    note: containing 11ty page objects
  url:
    type: url
    note: URL of the page to remove
*/
const removePage = (collection, url) =>
  collection.filter((page) => page.url !== url);

/* @docs
label: getData
category: Data
note: Return combined data from a collection
example: |
  {# all events #}
  {{ collections.all | getData('data.events') }}
  {# all events with a venue #}
  {{ collections.all | getData('data.events', 'venue') }}
  {# all events with a venue of 'Smashing Conf' #}
  {{ collections.all | getData('data.events', {'venue': 'Smashing Conf'}) }}
params:
  collection:
    type: array
    note: often an array of 11ty pages, but can be an array of any objects
  keys:
    type: string | false
    note: |
      use dot-notation (`data.press`) for nested keys,
      or `false` to filter without digging into nested data
  test:
    type: string | object
    default: undefined
    note: filter the resulting collection
*/
const getData = (collection, keys, test) => {
  const data = keys
    ? _.flatMap(_.filter(collection, keys), (page) => _.get(page, keys))
    : collection;
  return test ? _.filter(data, test) : data;
};

/* @docs
label: findData
category: Data
note: The same as getData, but only returns the first match in the collection
example: |
  {{ collections.all | findData('data.press', {'slug': 'handoff'}) }}
params:
  collection:
    type: array
    note: often an array of 11ty pages, but can be an array of any objects
  keys:
    type: string
    note: use dot-notation (`data.press`) for nested keys
  test:
    type: string | object
    default: undefined
    note: filter the resulting collection
*/
const findData = (collection, keys, test) => getData(collection, keys, test)[0];

/* @docs
label: getPage
category: Data
note: Return a single page by url, or return data from inside that page
example: |
  {{ collections.all | getPage('/work/timedesigner/', 'data.press') }}
params:
  collection:
    type: array
    note: often an array of 11ty pages, but can be an array of any objects
  url:
    type: string
    note: The url of the desired page
  keys:
    type: string
    note: use dot-notation (`data.press`) for nested keys
  test:
    type: string | object
    default: undefined
    note: filter the resulting collection
*/
const getPage = (collection, url, keys, test) => {
  const page = _.find(collection, { url });
  const data = keys ? _.get(page, keys) : page;
  return test ? _.filter(data, test) : data;
};

/* @docs
label: findPage
category: Data
note: Find the first page with any particular data
example: |
  {{ collections.all | findPage('data.cta_slug', 'workshop') }}
params:
  collection:
    type: array
    note: often an array of 11ty pages, but can be an array of any objects
  keys:
    type: string
    note: use dot-notation (`data.press`) for nested keys
  value:
    type: any
    note: Only find pages where the desired keys have a given value
*/
const findPage = (collection, keys, value) =>
  collection.find((page) => hasData(page, keys, value));

/* @docs
label: pageYears
category: Sorting
note: |
  Add `sort` and `year` keys to the page object,
  based on the latest date available (`date` or `end`),
  optionally including dates from events
params:
  collection:
    type: array
    note: containing 11ty page objects
*/
const pageYears = (collection) =>
  collection.map((page) => {
    const dates = [page.date];

    if (page.data.end && page.data.end !== 'ongoing') {
      dates.push(page.data.end);
    }

    if (page.data.events) {
      page.data.events.forEach((event) => {
        if (getDate(event.date) <= now()) {
          dates.push(event.date);
        }
      });
    }

    page.sort = dates.reduce((a, b) => (a > b ? a : b));
    page.year = getDate(page.sort, 'year');

    return page;
  });

/* @docs
label: eventSort
category: Sorting
note: |
  Sort pages based on either the page date,
  or the most recently past event date.
params:
  collection:
    type: array
    note: containing 11ty page objects
*/
const eventSort = (collection) =>
  pageYears(collection).sort((a, b) => a.sort > b.sort);

/* @docs
label: byYear
category: Sorting
note: |
  Runs a collection through `pageYears`,
  and then groups them by the resulting `year` value
params:
  collection:
    type: array
    note: containing 11ty page objects
*/
const byYear = (collection) => {
  if (!collection || collection.length === 0) {
    return [];
  }

  const groups = _.groupBy(pageYears(collection), 'year');

  return Object.keys(groups)
    .reverse()
    .map((year) => ({
      year,
      posts: groups[year],
    }));
};

module.exports = {
  isPublic,
  isCurrent,
  getCurrent,
  getPublic,
  getPage,
  findPage,
  hasData,
  getData,
  findData,
  withData,
  pageYears,
  eventSort,
  byYear,
  removePage,
};
