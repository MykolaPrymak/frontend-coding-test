import { hashString, findEntities, findEntity, removeEntity } from './helpers';

const entities = [
  { start: 160, end: 184, label: 'very important'},
  { start: 144, end: 159, label: 'very important'},
  { start: 62, end: 69, label: 'important' },
  { start: 116, end: 130, label: 'nonsense' },
  { start: 8, end: 29, label: 'nonsense' },
  { start: 8, end: 29, label: 'nonsense second' },
  { start: 0, end: 7, label: 'first' },
  { start: 3, end: 6, label: 'inside' },
];

describe('hashString', () => {
  const testSamples = [
    ['Miraculous', 1195263870],
    ['Aurora', 1972453248],
    ['Euphoria', 235492093],
    ['Serendipity', 352186988],
    ['Cherish', 1887554740],
    ['Elixir', 2078398431],
    ['Eternity', 1428719300],
    ['Love', 2374546],
    ['Solitude', 1545519931],
    ['Epiphany', 571283786],
    ['Silhouette', 410159928],
    ['Aesthete', 164793171],
    ['Sequoia', 647108111],
    ['Sibilance', 1493526370],
    ['Tranquillity', 632503340],
    ['Loquacious', 2109591763],
    ['Plethora', 2053904321],
    ['Delicacy', 887540786],
    ['Blooming', 588786913],
    ['Pluviophile', 1313316633],
    ['Felicity', 78202375],
    ['Clinomania', 1778909743],
    ['Galactic', 1736379974],
    ['Idyllic', 953722312],
    ['Incendiary', 715794236],
    ['Akimbo', 1962947515],
    ['Syzygy', 1803247625],
    ['Becoming', 1445072100],
    ['Conflate', 515410966],
    ['Umbrella', 1317269148],
    ['Nemesis', 793826098],
    ['Panacea', 867453499],
    ['Quintessential', 341238653],
    ['Penumbra', 395068192],
    ['Ethereal', 1354722902],
    ['Vestigial', 1512755462],
    ['Murmurous', 1638646637],
    ['Lagniappe', 1794068113],
    ['Bungalow', 1227560257],
    ['Ratatouille', 2000138822],
    ['Ripple', 1846959536],
    ['Scintilla', 1292124713],
    ['Glamour', 1773139387],
    ['Lagoon', 2026391588],
    ['Lithe', 73430452],
    ['Aquiver', 904587839],
    ['Mellifluous', 263811601],
    ['Ineffable', 2096337370],
    ['Hiraeth', 1704878967],
    ['Nefarious', 395700188],
    ['Cromulent', 1062841241],
    ['Effervescent', 1853520934],
    ['Sonder', 1812860577],
    ['Defenestration', 927227077],
    ['Eloquence', 2135393929],
    ['Vellichor', 633955902],
    ['Denouement', 1031787376],
    ['Incandescent', 774979089],
    ['Ephemeral', 1727612547],
    ['Oblivion', 216648322],
    ['Phosphenes', 634874379],
    ['Luminescence', 1947213207],
    ['Iridescent', 1483617158],
    ['Illicit', 736792882],
    ['Bombinate', 2005162443],
    ['Limerence', 662497432],
    ['Sonorous', 1608254552],
    ['Epoch', 67169385],
    ['Somnambulist', 1453757114],
    ['Aesthetic', 813621228],
    ['Sorcery', 360438625],
    ['Hullabaloo', 1193756825],
    ['Lyrical', 1991529302],
    ['Balletic', 1850278744],
    ['Thunderous', 1227265033],
    ['Euphonious', 1321688427],
    ['Ambivalence', 1017861241],
    ['Dissemble', 1963646706],
    ['Ebullience', 592123612],
    ['Photogenic', 1492825496],
    ['Vigorous', 1311259414],
    ['Dulcet', 2058150039],
    ['Gesticulate', 1154561278],
    ['Saunter', 758134470],
    ['Serene', 1821975396],
    ['Sumptuous', 673643353],
    ['Evanescence', 887292738],
    ['Cascade', 2075484524],
    ['Succulent', 1330278958],
    ['Dusk', 2141897],
    ['Saccharine', 1176546443],
    ['Summery', 192983414],
    ['Talisman', 546824239],
    ['Fetching', 301843208],
    ['Harbinger', 1263385766],
    ['Redolent', 706138083],
    ['Lassitude', 297073386],
    ['Dalliance', 840874885],
    ['Tintinnabulation', 160816049],
    ['Synthesize', 1703318454]
  ];

  it('return expected value', () => {
    testSamples.forEach(([string, hash]) => {
      expect(hashString(string)).toBe(hash);
    });
  });
});

describe('findEntities', () => {
  it('could find single entity', () => {
    expect(findEntities(entities, 160)).toStrictEqual([entities[0]]);
    expect(findEntities(entities, 161)).toStrictEqual([entities[0]]);
    expect(findEntities(entities, 182)).toStrictEqual([entities[0]]);
    expect(findEntities(entities, 183)).toStrictEqual([entities[0]]);
    
    //expect(findEntities(entities, 184)).toStrictEqual([entities[0]]);

    expect(findEntities(entities, 0)).toStrictEqual([entities[6]]);
    expect(findEntities(entities, 2)).toStrictEqual([entities[6]]);
    expect(findEntities(entities, 6)).toStrictEqual([entities[6]]);
  });

  it('could find multiple entities', () => {
    expect(findEntities(entities, 8)).toStrictEqual([entities[4], entities[5]]);

    expect(findEntities(entities, 0)).toStrictEqual([entities[6]]);
    expect(findEntities(entities, 2)).toStrictEqual([entities[6]]);
    expect(findEntities(entities, 3)).toStrictEqual([entities[6], entities[7]]);
    expect(findEntities(entities, 4)).toStrictEqual([entities[6], entities[7]]);
    expect(findEntities(entities, 5)).toStrictEqual([entities[6], entities[7]]);
    expect(findEntities(entities, 6)).toStrictEqual([entities[6]]);
    expect(findEntities(entities, 7)).toStrictEqual([]);
  });

  it('return zero entities if position not in range of any entity', () => {
    expect(findEntities(entities, 7)).toStrictEqual([]);
    expect(findEntities(entities, 8)).toStrictEqual([entities[4], entities[5]]);

    expect(findEntities(entities, 115)).toStrictEqual([]);
    expect(findEntities(entities, 116)).toStrictEqual([entities[3]]);
    expect(findEntities(entities, 129)).toStrictEqual([entities[3]]);
    expect(findEntities(entities, 130)).toStrictEqual([]);
    expect(findEntities(entities, 131)).toStrictEqual([]);
  });
});

describe('findEntity', () => {
  it('will return single entity in the range', () => {
    // Skip the entity duplication
    entities.slice(0, 5).forEach(entity => {
      expect(findEntity(entities, entity.start, entity.end)).toStrictEqual(entity);
    });
  });

  it('will return first entity in the range if couple of them exist', () => {
    // Skip the entity duplication
    const duplicatedEntityOne = entities[4];
    const duplicatedEntitySecond = entities[5];
    
    expect(findEntity(entities, duplicatedEntityOne.start, duplicatedEntityOne.end)).toStrictEqual(duplicatedEntityOne);
    expect(findEntity(entities, duplicatedEntitySecond.start, duplicatedEntitySecond.end)).toStrictEqual(duplicatedEntityOne);
  });

  it('will return entity if it in the range other entity', () => {
    // Skip the entity duplication
    const outsideEntity = entities[6];
    const insideEntity = entities[7];
    
    expect(findEntity(entities, outsideEntity.start, outsideEntity.end)).toStrictEqual(outsideEntity);
    expect(findEntity(entities, insideEntity.start, insideEntity.end)).toStrictEqual(insideEntity);
  });

  it('will return null if start is equal end', () => {
    const randomBase = 100;
    [...Array(10).keys()].map(() => {
      const position = Math.round(Math.random() * randomBase);

      return [position, position];
    }).forEach(([start, end]) => {
      expect(findEntity(entities, start, end)).toBeNull();
    });
  });

  it('will return null if nothing is found', () => {
    expect(findEntity(entities, 5, 15)).toBeNull();
    expect(findEntity(entities, 0, 30)).toBeNull();
    expect(findEntity(entities, 25, 26)).toBeNull();
  });
});

describe('removeEntity', () => {
  it('will remove single entity in the range', () => {
    entities.forEach((entity, idx, sliceOfEntities) => {
      // Make copy, remove the deleted element
      sliceOfEntities = sliceOfEntities.concat();
      sliceOfEntities.splice(idx, 1);

      expect(removeEntity(entities, entity)).toStrictEqual(sliceOfEntities);
    });
  });

  it('will delete exact entity even if the range if couple of them is the same', () => {
    // Skip the entity duplication
    const duplicatedEntityOne = entities[4];
    const duplicatedEntitySecond = entities[5];

    const sliceOfEntitiesOne = entities.concat();
    const sliceOfEntitiesSecond = entities.concat();
    sliceOfEntitiesOne.splice(4, 1);
    sliceOfEntitiesSecond.splice(5, 1);
    
    expect(removeEntity(entities, duplicatedEntityOne)).toStrictEqual(sliceOfEntitiesOne);
    expect(removeEntity(entities, duplicatedEntitySecond)).toStrictEqual(sliceOfEntitiesSecond);
  });

  it('will not delete any entity if it not exist in the list', () => {
    const testEntity = entities[Math.floor(Math.random() * entities.length)];
    
    expect(removeEntity(entities, {...testEntity, start: testEntity.end - 5})).toStrictEqual(entities);
    expect(removeEntity(entities, {...testEntity, end: testEntity.end + 15})).toStrictEqual(entities);
    expect(removeEntity(entities, {...testEntity, label: `${testEntity.start}_label`})).toStrictEqual(entities);
  });
});
