import biscuit from './biscuit.jpg'
import clementine from './clementine.jpg'
import waffles from './waffles.jpg'
import miso from './miso.jpg'
import pretzel from './pretzel.jpg'
import juniper from './juniper.jpg'
import meatball from './meatball.jpg'
import pickle from './pickle.jpg'
import story0 from './story-0.jpg'
import story1 from './story-1.jpg'
import story2 from './story-2.jpg'

const petPhotos: Record<string, string> = {
  biscuit,
  clementine,
  waffles,
  miso,
  pretzel,
  juniper,
  meatball,
  pickle,
}

const storyPhotos = [story0, story1, story2]

export function petPhoto(id: string): string | undefined {
  return petPhotos[id]
}

export function storyPhoto(idx: number): string | undefined {
  return storyPhotos[idx]
}
