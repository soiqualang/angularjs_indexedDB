/*global stemmer*/

self.FullText = (() => {

  function tokenize(text, locale) {
    const words = new Set();
    const segmenter = Intl.Segmenter(locale, {type: 'word'});
    const iterator = segmenter.segment(text);
    for (let {segment, breakType} of iterator) {
      if (breakType === 'none')
        continue;
      let word = segment;
      word = word.toLowerCase();
      word = stemmer(word);
      words.add(word);
    }
    return Array.from(words);
  }

  function search(index, query, locale, callback) {
    const results = [];

    const terms = tokenize(query, locale);
    if (terms.length === 0)
      throw new Error('no words in query');

    // Open a cursor for each term.
    let expect = 0;
    const requests = terms.map(term => index.openKeyCursor(term));
    requests.forEach(request => {
      ++expect;
      request.onsuccess = () => {
        if (--expect === 0)
          barrier();
      };
    });

    function barrier() {
      const cursors = requests.map(r => r.result);

      // If any cursor has reached end-of-range, we're done.
      if (cursors.includes(null)) {
        callback(results);
        return;
      }

      // Order cursors lowest/highest by primary key.
      cursors.sort((a, b) => indexedDB.cmp(a.primaryKey, b.primaryKey));

      // All equal? (lowest == highest)
      if (indexedDB.cmp(cursors[0].primaryKey,
                        cursors[cursors.length - 1].primaryKey) === 0) {
        // Yes - we have a match. Record it and advance all.
        results.push(cursors[0].primaryKey);
        expect = cursors.length;
        cursors.forEach(cursor => cursor.continue());
      } else {
        // No - advance lowest cursor.
        expect = 1;
        cursors[0].continue();
      }
    }
  }

  return {
    tokenize: tokenize,
    search: search
  };

})();
