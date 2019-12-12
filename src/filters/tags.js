'use strict';

const { withData } = require('./pages');
const { unique, slugify } = require('./utils');
const { get } = require('./events');

const topCount = 6;
const inTopCount = (count) => typeof count === 'number' && count <= topCount;
const isPublic = (tag) => tag !== 'all' && !tag.startsWith('_');
const publicTags = (tags) =>
  tags ? tags.filter((tag) => isPublic(tag)) : tags;

const withTag = (collection, tag) => withData(collection, 'tags', tag);

const tagData = (collections) => {
  const eventTags = get(collections.all, false, false)
    .map((e) => e.tags)
    .reduce((all, one) => [...all, ...one], []);

  return unique(eventTags)
    .filter((tag) => isPublic(tag))
    .map((tag) => {
      const tagEvents = get(collections.all, tag, false);
      return {
        tag,
        events: tagEvents,
        count: tagEvents.length,
      };
    })
    .filter((item) => item.count !== 0)
    .sort((a, b) => b.count - a.count);
};

const getTags = (collections, top = topCount) =>
  tagData(collections)
    .slice(0, top || collections.length)
    .map((item) => item.tag);

const groupTags = (collections, top = topCount) => {
  const grouped = {};
  const sorted = [];

  // group by popularity
  tagData(collections).forEach((item, i) => {
    const group = i < top ? 'top' : Math.ceil(item.count / 5) * 5;
    if (grouped[group]) {
      grouped[group].push(item);
    } else {
      grouped[group] = [item];
    }
  });

  // sort the groups
  Object.keys(grouped).forEach((group) => {
    sorted.push({
      group,
      tags: grouped[group],
    });
  });

  return sorted.reverse();
};

const displayName = (tag) => (tag.startsWith('_') ? tag.slice(1) : tag);

const tagLink = (tag, collections) => {
  const pages = collections.all.filter((page) => page.data.index === tag);

  const extra = collections.all
    .map((page) => page.data.extraTags || [])
    .reduce((all, tags) => [...all, ...tags], [])
    .includes(tag);

  const index = pages.length ? pages[0].url : null;

  const fallback = extra || collections[tag] ? `/tags/${slugify(tag)}/` : null;

  return index || fallback;
};

module.exports = {
  topCount,
  isPublic,
  publicTags,
  getTags,
  groupTags,
  withTag,
  displayName,
  tagLink,
  inTopCount,
};
