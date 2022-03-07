class Room {
  constructor(config) {
    this.location = config.location;
    this.size = config.size;
    this.id = `room_${parseInt(Math.random() * 10000)}`;

    this.doors = new Set();
    this.references = [];
    this.room = [];
    this.types = this._getRandomRoomTypes()
    this.wallCharacter = String.fromCodePoint(0x2B1B);
    this.floorChracter = String.fromCodePoint(0x2B1C);
    this.trapCharacter = String.fromCodePoint(0x1FAA4);
    this.doorCharacter = String.fromCodePoint(0x1F6AA);
    this.enemyCharacters = [String.fromCodePoint(0x1F47B)];
    this.rewardCharacter = String.fromCodePoint(0x1F4B0);
    this.numberOfPossibleEnemies = Math.floor(Math.random() * 2); // 0 to 3 enemies

    // drawing
    this.stroke = 200;
    this.fill = 50;
    this.x = null
    this.y = null
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
      this.room[coords[0]][coords[1]] = this.rewardCharacter;
    }

    // place doors

    this.doors.forEach((doorName) => {
      try {
        if (doorName === 'north') {
          this.room[0][parseInt(this.size / 2)] = this.doorCharacter;
        } else if (doorName === 'south') {
          this.room[this.size - 1][parseInt(this.size / 2)] = this.doorCharacter;
        } else if (doorName === 'east') {
          this.room[parseInt(this.size / 2)][this.size - 1] = this.doorCharacter;
        } else if (doorName === 'west') {
          this.room[parseInt(this.size / 2)][0] = this.doorCharacter;
        }
      } catch(e) {
        debugger
      }
    })
  }

  draw() {
    this._drawRoom();
    this._drawReferences();
    this._drawHover();
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

    if (!typesArray.length) {
      typesArray = ['normal']
    }

    return typesArray;
  }

  _getRandomCoordinates() {
    let row = parseInt(Math.random() * this.size - 1);
    let col = parseInt(Math.random() * this.size - 1);

    return [row, col];
  }

  _drawRoom() {
    stroke(this.stroke);
    fill(this.fill);
    text(`${this.location[0]}, ${this.location[1]}`, this.x, this.y - 5)
    rect(this.x, this.y, 20);
  }

  _drawReferences() {
    for (let i = 0; i < this.references.length; i++) {
      let currentReference = this.references[i];
      line(this.x + 10, this.y + 10, currentReference.x + 10, currentReference.y + 10)
    }
  }

  _drawHover() {
    if (
      mouseX > this.x - 15 &&
      mouseX < this.x + 15 &&
      mouseY > this.y - 15 &&
      mouseY < this.y + 15
    ) {
      this.fill = 200;

      let output = '';
      for (let i = 0; i < this.room.length; i++) {
        let row = this.room[i];
        output += `${row.join('')}\n`
      }

      text(output, window.innerWidth / 4, window.innerHeight / 2);
    } else {
      this.fill = 50;
    }
  }
}
