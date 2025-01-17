import { expect, test } from 'vitest'
import { Slug } from './slug'

test('it should to be able to create a new slug from text', () => {
  const slug = Slug.createFromText('Example of a title!')

  expect(slug.value).toEqual('example-of-a-title')
})
