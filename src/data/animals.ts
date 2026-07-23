import type { Animal } from '../types'

export const animals: Animal[] = [
  { id: 'haku', name: 'Haku', species: 'dog', breed: 'Australian Shepherd', age: 2, dist: 1.2, shelter: 'Happy Tails Rescue', fee: 'R1,450', score: 88, mutual: true, tags: ['food-motivated', 'certified goofball', 'leash optimist'], kids: 'YES', dogs: 'YES', cats: 'ASK', bio: 'Haku believes every stranger is a friend who hasn’t thrown a ball yet. Will trade unconditional love for exactly one (1) slice of cheese.' },
  { id: 'moon-cake', name: 'Moon Cake', species: 'dog', breed: 'Corgi', age: 6, dist: 0.8, shelter: 'Whisker Haven', fee: 'R950', score: 81, mutual: false, tags: ['chaos gremlin', 'sunbeam sommelier', '4am parkour'], kids: 'YES', dogs: 'NO', cats: 'YES', bio: 'One brain cell, zero regrets. Moon Cake will knock your pen off the desk and then look at you like YOU did it.' },
  { id: 'yuki', name: 'Yuki', species: 'dog', breed: 'White Alsatian', age: 10, dist: 3.1, shelter: 'Paws & Effect', fee: 'R1,650', score: 76, mutual: false, tags: ['professional loaf', 'herds children', 'big drama'], kids: 'YES', dogs: 'ASK', cats: 'YES', bio: 'Short king. Waffles has never once caught his tail but remains undefeated in optimism. Screams at the vacuum on your behalf.' },
  { id: 'miso', name: 'Miso', species: 'cat', breed: 'Siamese', age: 3, dist: 2.4, shelter: 'Whisker Haven', fee: 'R1,050', score: 72, mutual: false, tags: ['opinionated', 'velcro cat', 'bird TV critic'], kids: 'ASK', dogs: 'NO', cats: 'ASK', bio: 'Miso has notes. About everything. Adopt her and receive a lifetime subscription to running commentary, free of charge.' },
  { id: 'pretzel', name: 'Pretzel', species: 'dog', breed: 'Dachshund mix', age: 5, dist: 4.6, shelter: 'Happy Tails Rescue', fee: 'R1,250', score: 84, mutual: true, tags: ['burrito enthusiast', 'snoot booper', 'couch strategist'], kids: 'YES', dogs: 'YES', cats: 'YES', bio: 'Half dog, half blanket. Pretzel’s love language is tunneling under your duvet and sighing dramatically until cuddled.' },
  { id: 'juniper', name: 'Juniper', species: 'cat', breed: 'Tuxedo', age: 2, dist: 1.9, shelter: 'Paws & Effect', fee: 'R1,000', score: 79, mutual: false, tags: ['formalwear always', 'lap auditor', 'biscuit maker'], kids: 'YES', dogs: 'ASK', cats: 'YES', bio: 'Dressed for a gala, lives for a nap. Juniper kneads dough professionally (on your stomach, at 6am).' },
  { id: 'meatball', name: 'Meatball', species: 'dog', breed: 'Pit mix', age: 3, dist: 5.8, shelter: 'Paws & Effect', fee: 'R1,150', score: 86, mutual: false, tags: ['110% wiggle', 'sun worshipper', 'gentle unit'], kids: 'YES', dogs: 'YES', cats: 'ASK', bio: 'Built like a coffee table, soft like a marshmallow. Meatball’s tail has never stopped wagging. Scientists are baffled.' },
  { id: 'pickle', name: 'Pickle', species: 'cat', breed: 'Sphynx', age: 4, dist: 7.2, shelter: 'Whisker Haven', fee: 'R1,500', score: 70, mutual: true, tags: ['heated blanket seeker', 'alien prince', 'sweater collection'], kids: 'ASK', dogs: 'YES', cats: 'YES', bio: 'Pickle is naked and unbothered. Runs warmer than your laptop and demands to be treated like the royalty he clearly is.' },
]

export const detailCaptions: Record<string, [string, string, string]> = {
  haku: ['The face when someone spells W-A-L-K', 'What Sunday self-care looks like', 'Proof I can sit (for cheese)'],
  'moon-cake': ['Mid-parkour, 4:07am', 'My sunbeam, my rules', 'The pen absolutely deserved it'],
  yuki: ['Peak loaf performance', 'Herding practice (the children are fine)', 'Vacuum stand-off, round 3'],
  miso: ['Reviewing the bird channel', 'I have notes about dinner', 'Velcro mode: engaged'],
  pretzel: ['Fully deployed burrito', 'Snoot ready for booping', 'Duvet tunnel, day 12'],
  juniper: ['Black tie, every day', 'Currently auditing this lap', 'Biscuit production, 6am sharp'],
  meatball: ['110% wiggle, captured live', 'Sun worship in progress', 'Gentle unit at rest'],
  pickle: ['Sweater weather is always', 'Royalty demands a heated blanket', 'Alien prince glamour shot'],
}
