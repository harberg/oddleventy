'use strict';

const slugify = require('slugify');

const { withData } = require('./pages');
const { unique } = require('./utils');

/* @docs
label: Tag Filters
category: File
*/

/* @docs
label: isPublic
category: Visibility
note: Return false if a tag name starts with `_`
params:
  tag:
    type: string
*/
const isPublic = (tag) => !tag.startsWith('_');

/* @docs
label: publicTags
category: Visibility
note: Remove private `_<name>` tags from a list
params:
  tags:
    type: array
*/
const publicTags = (tags) =>
  tags ? tags.filter((tag) => isPublic(tag)) : tags;

/* @docs
label: displayName
category: Visibility
note: |
  Returns a tag name with private `_` removed,
  for those rare cases where we want to display private tags.
params:
  tag:
    type: string
*/
const displayName = (tag) => (tag.startsWith('_') ? tag.slice(1) : tag);

/* @docs
label: allTags
category: List
note: Returns a list of public tag names in a collection
params:
  collection:
    type: array of pages
*/
const allTags = (collection) => {
  const tags = withData(collection, 'tags')
    .map((page) => page.data.tags)
    .reduce((all, one) => [...all, ...one], []);

  return unique(publicTags(tags));
};

/* @docs
label: tagData
category: List
note: |
  Returns an array tag-data objects for every tag,
  including name (`tag`), and `pageCount`
params:
  collections:
    type: array of collections
  sort:
    type: pageCount | tag
    default: 'pageCount'
*/
const tagData = (collections, sort = 'pageCount') =>
  allTags(collections.all)
    .map((tag) => ({
      tag,
      pageCount: collections[tag].length,
    }))
    .sort((a, b) => b[sort] - a[sort]);

/* @docs
label: tagLink
category: Links
note: |
  Returns the link for a given tag --
  either the auto-generated tag page,
  or page marked as `index` for that tag
params:
  tag:
    type: string
  all:
    type: array of all pages (`collections.all`)
*/
const tagLink = (tag, all) => {
  const index = withData(all, 'index', tag, true);
  return index ? index.url : `/tags/${slugify(tag)}/`;
};

module.exports = {
  isPublic,
  publicTags,
  allTags,
  tagData,
  displayName,
  tagLink,
};
