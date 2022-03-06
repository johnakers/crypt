class Room {
  constructor(config) {
    this.location = config.location;
    this.fill = 50;
    this.id = `room_${parseInt(Math.random() * 10000)}`;
    this.doors = new Set();
    this.references = [];
    this.room = [];
    this.size = 7 // # of tiles === must be odd
    this.types = this._getRandomRoomTypes()
    this.wallCharacter = String.fromCodePoint(0x1F7E7);
    this.floorChracter = String.fromCodePoint(0x1F7E9);
    this.trapCharacter = String.fromCodePoint(0x1FAA4);
    this.doorCharacter = String.fromCodePoint(0x1F6AA);
    this.enemyCharacters = [
      String.fromCodePoint(0x1F98D),
      String.fromCodePoint(0x1F47E),
      String.fromCodePoint(0x1F47B),
    ]
    this.numberOfPossibleEnemies = Math.floor(Math.random() * 4); // 0 to 3 enemies
    this.rewardCharacter = '💰'

    // for p5 only
    this.x = null
    this.y = null

    this.possibleEnd = false
  }

  get referenceIds() {
    return this.references.map(ref => ref.id)
  }

  addDoor(doorName, reference) {
    this.doors.add(doorName);
    this.references.push(reference);

    const oppositeDoors = {
      'north': 'south',
      'east': 'west',
      'south': 'north',
      'west': 'east'
    }

    if (!reference.referenceIds.includes(this.id)) {
      reference.references.push(this);
      reference.doors.add(oppositeDoors[doorName]);
    }
  }

  _getRandomRoomTypes() {
    const types = {
      'treasure': 0.2,
      'trap': 0.4,
      'catwalk': 0.3 // need to build, as it changes the tiles
    };

    let typesArray = [];
    for (let key in types) {
      let chance = Math.random();
      if (chance > (1 - types[key])) {
        typesArray.push(key);
      }
    }

    return typesArray;
  }

  _getRandomCoordinates() {
    let row = parseInt(Math.random() * this.size - 1);
    let col = parseInt(Math.random() * this.size - 1);

    return [row, col];
  }

  build() {
    // build grid
    for (let i = 0; i < this.size; i++) {
      let row = [];
      for (let j = 0; j < this.size; j++) {
        if (
          i === 0 ||
          j === 0 ||
          j === this.size - 1 ||
          i === this.size - 1
        ) {
          row.push(this.wallCharacter);
        } else {
          row.push(this.floorChracter);
        }
      }

      this.room.push(row);
    }

    // place enemies
    for (let i = 0; i < this.numberOfPossibleEnemies; i++) {
      let randomEnemy = this.enemyCharacters[Math.floor(Math.random() * this.enemyCharacters.length)];
      let coords = this._getRandomCoordinates();
      this.room[coords[0]][coords[1]] = randomEnemy;
    }

    // reward/treasure
    if (this.types.includes('treasure')) {
      let coords = this._getRandomCoordinates();
      this.room[coords[0], coords[1]] = this.rewardCharacter;
    }

    // place doors
    for (let i = 0; i < this.doors.length; i++) {
      let doorName = this.doors[i];
      if (doorName === 'north') {
        this.room[0][parseInt(this.size / 2)] = this.doorCharacter;
      } else if (doorName === 'south') {
        this.room[this.size - 1][parseInt(this.size / 2)] = this.doorCharacter;
      } else if (doorName === 'east') {
        this.room[parseInt(this.size / 2)][this.size - 1] = this.doorCharacter;
      } else if (doorName === 'west') {
        this.room[parseInt(this.size / 2)][0] = this.doorCharacter;
      }
    }
  }

  // super simple draw
  draw() {
    document.querySelector('#rooms').innerHTML = ''; // clear

    let output = '';
    for (let i = 0; i < this.room.length; i++) {
      try {
        output += `${this.room[i].join('')}<br />`
      } catch(e) {
        debugger
      }
    }

    document.querySelector('#room').innerHTML = output;
    document.querySelector('#room').innerHTML += `<br />${this.location[0]} / ${this.location[1]}`;
  }
}

// 🟧🟧🟧🚪🟧🟧🟧🟧
// 🟧🟩🟩🟩🟩🟩🟩🟧
// 🟧🟩🟩🟩🪤🟩🟩🟧
// 🟧🟩🟩🟩🟩🟩🟩🟧
// 🚪🟩🟩🟩🟩🟩🟩🟧
// 🟧👻🟩🟩💰🟩🟩🟧
// 🟧🟩🟩🟩🟩🟩🟩🟧
// 🟧🟧🟧🚪🟧🟧🟧🟧
