'use strict';

const _ = require('lodash');

const { now, getDate } = require('./time');

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
  const live = page.data.draft !== true;
  const title = page.data && page.data.title;
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
const isCurrent = (page) =>
  page.data.end === 'ongoing' ||
  !page.data.end ||
  getDate(page.data.end) >= now;

/* @docs
label: getPublic
category: Filter
note: Return only the public pages from a collection
params:
  collection:
    type: array
    note: containing 11ty page objects
*/
const getPublic = (collection) => collection.filter((page) => isPublic(page));

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
*/
const hasData = (obj, keys, value) =>
  value ? _.includes(_.get(obj, keys), value) : _.hasIn(obj, keys);

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
*/
const withData = (collection, keys, value) =>
  collection.filter((page) => hasData(page, keys, value));

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
note: Return a single page by url, or data from inside that page
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
label: pageContent
category: Data
note: Return the content of any page
params:
  collection:
    type: array
    note: containing 11ty page objects
  url:
    type: url
*/
const pageContent = (collection, url) =>
  getPage(collection, url, 'templateContent');

/* @docs
label: render
category: Data
note: Returns the value for a given key from either `renderData` or `data`
params:
  page:
    type: 11ty page object
  key:
    type: string
*/
const render = (page, key) =>
  page.data.renderData
    ? page.data.renderData[key] || page.data[key]
    : page.data[key];

const pageYears = (collection) =>
  collection.map((page) => {
    page.year = getDate(page.date, 'year');
    return page;
  });

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

/* @docs
label: pageType
category: Data
note: |
  Return one of several resource "types"
  which we can use to provide different list styling,
  or filtering.
params:
  page:
    type: 11ty page object
*/
const pageType = (page) => {
  const tags = [
    'Client Work',
    'OddTools',
    'Open Source',
    'Talks',
    'Workshops',
    'Podcasts',
    'Videos',
    'Links',
    'News',
  ];

  return tags.find((type) => hasData(page, 'data.tags', type));
};

module.exports = {
  isPublic,
  isCurrent,
  getPublic,
  getPage,
  hasData,
  getData,
  findData,
  pageContent,
  pageType,
  withData,
  render,
  byYear,
};
