import { randomInt } from 'node:crypto';

const germanAdjectives = [
  'kleiner',
  'großer',
  'schneller',
  'lustiger',
  'freundlicher',
  'mutiger',
  'ruhiger',
  'roter',
  'blauer',
  'grüner',
  'goldener',
] as const;

const germanAnimals = [
  'Fuchs',
  'Bär',
  'Panda',
  'Tiger',
  'Hase',
  'Elefant',
  'Löwe',
  'Drache',
] as const;

export function generateOrderName() {
  const adjective = germanAdjectives[randomInt(germanAdjectives.length)];
  const animal = germanAnimals[randomInt(germanAnimals.length)];
  const number = randomInt(1, 100);

  return `${adjective} ${animal} ${number}`;
}
