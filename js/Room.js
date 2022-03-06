class Room {
  constructor(config) {
    this.location = config.location;

    this.id = `room_${parseInt(Math.random() * 10000)}`;
    this.doors = [];
    this.references = [];

    // for p5 only
    this.x = null
    this.y = null

    this.possibleEnd = false
  }

  get referenceIds() {
    return this.references.map(ref => ref.id)
  }

  addDoor(doorName, reference) {
    this.doors.push(doorName);

    this.references.push(reference);

    try {
      !reference.referenceIds.includes(this.id)
    } catch(e) {
      debugger
    }

    if (!reference.referenceIds.includes(this.id)) {
      reference.references.push(this)
    }
  }
}
