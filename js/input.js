const gridLabel = document.querySelector('#grid_label');
const gridSlider = document.querySelector('#grid_slider');

const roomSizeLabel = document.querySelector('#room_label');
const roomSize = document.querySelector('#room_size');

const doorPercentLabel = document.querySelector('#door_label');
const doorPercent = document.querySelector('#door_chance');

function update(value) {
  gridLabel.innerText = `grid: ${gridSlider.value} x ${gridSlider.value}`;
  roomSizeLabel.innerText = `room: ${roomSize.value} x ${roomSize.value}`;
  doorPercentLabel.innerText = `door %: ${parseInt(doorPercent.value * 100)}`;

  rebuild();
}

function rebuild() {
  let gridSize = gridSlider.value;

  floor = new Floor({
    size: gridSize,
    doorCreationChance: parseFloat(doorPercent.value)
  });

  floor.build();
  console.log(floor);
}
