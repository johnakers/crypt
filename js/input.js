const downloadDiv = document.querySelector('#download');
const form = document.querySelector('#form');
const floorSize = document.querySelector('#floor_size');
const roomSize = document.querySelector('#room_size')
const submitButton = document.querySelector('button');

submitButton.addEventListener('click', function (e) {
  floor = new Floor({
    size: parseInt(floorSize.value),
    doorCreationChance: 0.5
  });

  floor.build();
  console.log(floor)

  downloadDiv.style.display = 'block';
  form.style.display = 'none';
});