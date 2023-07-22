import numbers from '../../data/numbers.json';
import sentences from '../../data/sentences.json';
import words from '../../data/words.json';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const _ = require('lodash');

export const shuffleList = (type: string) => {
  switch (type) {
    case '1':
      return _.shuffle(words).slice(0, 150);
    case '3':
      return _.shuffle(numbers).slice(0, 50);
    case '2':
      // eslint-disable-next-line no-case-declarations
      let sentencesArray = _.shuffle(sentences);
      sentencesArray = sentencesArray.slice(0, 12);
      return sentencesArray;
    default:
      return _.shuffle(words).slice(0, 150);
  }
};
