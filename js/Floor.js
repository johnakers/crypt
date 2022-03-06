class Floor {
  constructor(config) {
    this.id = `floor_${parseInt(Math.random() * 10000)}`; // just a random ID
    this.size = config.size;
    this.doorCreationChance = config.doorCreationChance;

    this.floor = [];
  }

  build() {
    this._buildGrid();
    this._buildReferences();
    this._buildRooms();
  }

  draw() {
    // stroke(200);
    // fill(50);
    const start = 20;
    const drawIncrement = 50;

    // draw grid
    for (let i = 0; i < this.floor.length; i++) {
      for (let j = 0; j < this.floor[i].length; j++) {
        let currentRoom = this.floor[i][j];

        // don't draw rooms with no edges/connections/hallways
        if (!currentRoom.references.length) {
          continue;
        }

        currentRoom.x = (drawIncrement * (j % this.size)) + start;
        currentRoom.y = (drawIncrement * (i % this.size)) + start;
        currentRoom.draw();
      }
    }
  }

  // void
  _buildGrid() {
    for (let i = 0; i < this.size; i++) {

      var row = [];
      for (let j = 0; j < this.size; j++) {
        row.push(new Room({ location: [i, j], size: 7 }));
      }

      this.floor.push(row);
    }
  }

  // void
  _buildReferences() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let currentRoom = this.floor[i][j];
        let availableDoors = [];

        // top left
        if (i === 0 && j === 0) {
          availableDoors.push(['south', 'east']);
        }
        // top right
        else if (i === 0 && j === this.size - 1) {
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

  _buildRooms() {
    for (let i = 0; i < this.floor.length; i++) {
      for (let j = 0; j < this.floor[i].length; j++) {
        this.floor[i][j].build();
      }
    }
  }
}
