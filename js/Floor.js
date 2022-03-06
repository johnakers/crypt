class Floor {
  constructor(config) {
    this.id = `floor_${parseInt(Math.random() * 10000)}`; // just a random ID
    this.size = config.size;
    this.doorCreationChance = 0.5; // 50% chance to create a door, in a given direction
    this.floor = [];
  }

  get connectedRooms() {
    let rooms = this.floor.flat();

    let result = [];
    for (let i = 0; i < rooms.length; i++) {
      let room = rooms[i]
      if (room.references.length) {
        result.push(room);
      }
    }

    return result;
  }

  build() {
    // build grid (make nodes)
    for (let i = 0; i < this.size; i++) {

      var row = [];
      for (let j = 0; j < this.size; j++) {
        row.push(new Room({ location: [i, j] }));
      }

      this.floor.push(row);
    }

    // assign doors (connect edges)
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let currentRoom = this.floor[i][j];
        let availableDoors = [];

        // top left
        if (i === 0 && j === 0) {
          availableDoors.push(['south', 'east']);
        }
        // top right
        else if (i === 0 && j === this.size -1) {
          availableDoors.push(['south', 'west']);
        }
        // bottom left
        else if (i === this.size - 1 && j === 0) {
          availableDoors.push(['east', 'north']);
        }
        // bottom right
        else if (i === this.size - 1 && j === this.size - 1) {
          availableDoors.push(['west', 'north']);
        }
        // bottom
        else if (i === this.size - 1) {
          availableDoors.push(['west', 'north', 'east']);
        }
        // left
        else if (j === 0) {
          availableDoors.push(['south', 'east', 'north']);
        }
        // top
        else if (i === 0) {
          availableDoors.push(['south', 'east', 'west']);
        }
        // right
        else if (j === this.size - 1) {
          availableDoors.push(['south', 'west', 'north']);
        }

        availableDoors = availableDoors.flat();

        // triple nested... hmmm
        for (let k = 0; k < availableDoors.length; k++) {
          let doorChance = Math.random();

          if (doorChance >= (1 - this.doorCreationChance)) {
            let doorName = availableDoors[k];

            let otherRoom = this._otherRoomFromDoor(i, j, doorName);
            currentRoom.addDoor(doorName, otherRoom);
          }
        }
      }
    }

    return this.floor;
  }

  _otherRoomFromDoor(row, col, direction) {
    if (direction === 'east') {
      return this.floor[row][col + 1];
    } else if (direction === 'west') {
      return this.floor[row][col - 1];
    } else if (direction === 'north') {
      return this.floor[row - 1][col];
    } else if (direction === 'south') {
      return this.floor[row + 1][col];
    }
  }
}
