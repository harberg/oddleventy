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
  collection:
    type: array of pages
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
  collection:
    type: array of pages
*/
const isCurrent = (page) =>
  page.data.end === 'ongoing' || !page.data.end || getDate(page.data.end) > now;

/* @docs
label: getPublic
category: Filter
note: Return only the public pages from a collection
params:
  collection:
    type: array of pages
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
    type: array of pages
  keys:
    type: string
    note: Any nested data attributes to get
  value:
    type: any
    note: Only get pages where the desired attributes have this value
*/
const withData = (collection, keys, value) =>
  collection.filter((page) => hasData(page, keys, value));

const buildEvent = (page, event) => {
  const eventPage = {};

  Object.keys(page).forEach((key) => (eventPage[key] = page[key]));

  eventPage.date = getDate(event.date) || eventPage.date;
  eventPage.data.is_event = true;

  Object.keys(event).forEach((key) => (eventPage.data[key] = event[key]));

  return eventPage;
};

const includeEvents = (collection, replace = true) => {
  const results = [];

  collection.forEach((page) => {
    if (page.data.events) {
      page.data.events.forEach((event) => {
        results.push(buildEvent(page, event));
      });

      if (!replace) {
        results.push(page);
      }
    } else {
      results.push(page);
    }
  });

  return results.sort((a, b) => b.date - a.date);
};

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
    note: often an array of pages, but can be an array of  any objects
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
    note: often an array of pages, but can be an array of  any objects
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
    note: often an array of pages, but can be an array of  any objects
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
    type: array of pages
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
    type: page object
  key:
    type: string
*/
const render = (page, key) =>
  page.data.renderData
    ? page.data.renderData[key] || page.data[key]
    : page.data[key];

/* @docs
label: pageType
category: Data
note: |
  Return one of several resource "types"
  which we can use to provide different list styling,
  or filtering.

  Current types include:
  - client (tagged as 'Client Work')
  - tool (tagged as 'OddTools')
  - oss (tagged as 'Open Source')
  - talk (tagged as 'Talks')
  - workshop (tagged as 'Workshops')
  - podcast (tagged as 'Podcast')
  - video (tagged as 'Video')
  - **article** (the default)
params:
  page:
    type: page object
*/
const pageType = (page) => {
  if (hasData(page, 'data.tags', 'Client Work')) {
    return 'client';
  } else if (hasData(page, 'data.is_event')) {
    return 'event';
  } else if (hasData(page, 'data.tags', 'OddTools')) {
    return 'tool';
  } else if (hasData(page, 'data.tags', 'Open Source')) {
    return 'oss';
  } else if (hasData(page, 'data.tags', 'Talks')) {
    return 'talk';
  } else if (hasData(page, 'data.tags', 'Workshops')) {
    return 'workshop';
  } else if (hasData(page, 'data.tags', 'Podcast')) {
    return 'podcast';
  } else if (hasData(page, 'data.tags', 'Video')) {
    return 'video';
  }

  return 'article';
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
  buildEvent,
  includeEvents,
};
