renderDetails(getMasterDetails());

const masterTags = [
  {
    name: 'Meetings'
  },
  {
    name: 'Personal'
  },
  {
    name: 'Ministry'
  },
  {
    name: 'Study'
  },
  {
    name: 'Chatting'
  },
  {
    name: 'Cooking'
  },
  {
    name: 'Friends'
  },
  {
    name: 'Support'
  }
];

function renderTagScreen(detail) {
  const masterDetails = getMasterDetails();
  const index = masterDetails.findIndex(masterDetail => masterDetail.refID === detail.refID);

  const detailEl = document.getElementById('detail-' + index);
  detailEl.innerHTML = '';
  detailEl.style.all = 'revert';
  detailEl.insertAdjacentHTML('afterbegin', `
        <div class="tags-container">

          <div class="header">
            <button id="back"><i class="fa-solid fa-arrow-left"></i></button>
            <label for="tags-filter">Filter</label>
            <input type="text" name="tags-filter" id="tags-filter">
          </div>

          <div class="tag-results" id="tag-results">Hi</div>
        </div>
      `);

  const icons = document.querySelectorAll('.utilities');
  icons.forEach(icon => icon.style.pointerEvents = 'none');

  document.getElementById('tags-filter').addEventListener('input', filterTags);
  renderTags(masterTags, index);
}

function renderTags(tagsArr, currentDetailIndex) {
  const tagResults = document.querySelector('.tag-results');
  tagResults.innerHTML = '';

  for (let i = 0; i < tagsArr.length; i++) {
    const tag = tagsArr[i];

    const ul = document.createElement('ul');
    const li = document.createElement('li');
    li.innerText = tag.name;
    li.addEventListener('click', () => assignTag(tag, currentDetailIndex));

    ul.append(li);
    tagResults.append(ul);
  }
}

function assignTag(tag, currentDetailIndex) {
  renderDetails(getMasterDetails());


}

function filterTags() {
  const query = document.getElementById('tags-filter').value;
  let filteredTags = [];

  masterTags.forEach(tag => {
    if (tag.name.toString().toLowerCase().includes(query.toLowerCase())) filteredTags.push(tag);
  });

  let uniqueFilteredTags = [... new Set(filteredTags)];
  renderTags(uniqueFilteredTags);
}

function editDetail(detail) {
  const masterDetails = getMasterDetails();
  const index = masterDetails.findIndex(masterDetail => masterDetail.refID === detail.refID);

  const detailEl = document.getElementById('detail-' + index);
  detailEl.innerHTML = '';
  detailEl.style.all = 'revert';
  detailEl.insertAdjacentHTML('afterbegin', `
        <div class="edit-container">
          <form id="edit-form">
            <label for="edit-name">Name</label>
            <input type="text" name="edit-name" id="edit-name">
            <br>

            <label for="edit-id">ID</label>
            <input type="text" name="edit-id" id="edit-id">
            <br>

            <label for="edit-passcode">Code</label>
            <input type="text" name="edit-passcode" id="edit-passcode">
            <br>

            <label for="edit-zoom">Zoom</label>
            <input type="text" name="edit-zoom" id="edit-zoom">
            <br>

            <div class="edit-buttons">
              <button id="back"><i class="fa-solid fa-arrow-left"></i></button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      `);

  const icons = document.querySelectorAll('.utilities');
  icons.forEach(icon => icon.style.pointerEvents = 'none');

  document.getElementById('edit-name').value = detail.name;
  document.getElementById('edit-id').value = detail.id;
  document.getElementById('edit-passcode').value = detail.passcode;
  document.getElementById('edit-zoom').value = detail.zoom;

  const editForm = document.getElementById('edit-form');

  editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedValues = {
      name: document.getElementById('edit-name').value,
      id: document.getElementById('edit-id').value,
      passcode: document.getElementById('edit-passcode').value,
      zoom: fixURL(document.getElementById('edit-zoom').value),
    };

    masterDetails[index].name = updatedValues.name;
    masterDetails[index].id = updatedValues.id;
    masterDetails[index].passcode = updatedValues.passcode;
    masterDetails[index].zoom = updatedValues.zoom;

    localStorage.setItem('masterDetails', JSON.stringify(masterDetails));
    const updatedMasterDetails = getMasterDetails();
    renderDetails(updatedMasterDetails);
  });
}

function saveNewDetail() {
  const createForm = document.getElementById('create-form');

  const nameField = createForm['name'];
  const idField = createForm['id'];
  const passcodeField = createForm['passcode'];
  const zoomField = createForm['zoom'];

  const newDetail = {
    name: nameField.value,
    id: idField.value,
    passcode: passcodeField.value,
    zoom: fixURL(zoomField.value),
    refID: validateRefID()
  };

  const masterDetails = getMasterDetails();
  if (masterDetails == null) {
    localStorage.setItem('masterDetails', JSON.stringify([newDetail]));
  } else {
    masterDetails.push(newDetail);
    localStorage.setItem('masterDetails', JSON.stringify(masterDetails));
  }

  const updatedMasterDetails = getMasterDetails();
  renderDetails(updatedMasterDetails);
}

function renderDetails(detailsArr) {
  document.querySelector('.details-container').innerHTML = '';

  if (detailsArr == null) {
    renderCreateForm();
  } else {
    sortDetailsAlphabetically(detailsArr);
    for (let i = 0; i < detailsArr.length; i++) {
      const detail = detailsArr[i];
      renderDetail(detail);
    }
    renderCreateForm();
  }

  setFoundCount(detailsArr);
}

function renderCreateForm() {
  const detailsContainer = document.querySelector('.details-container');

  detailsContainer.insertAdjacentHTML('beforeend', `<div class="create-container">
    <form id="create-form">
      <label for="name">Name</label>
      <input type="text" name="name" id="name" required>
      <br>

      <label for="id">ID</label>
      <input type="text" name="id" id="id" required>
      <br>

      <label for="passcode">Code</label>
      <input type="text" name="passcode" id="passcode" required>
      <br>

      <label for="zoom">Zoom</label>
      <input type="text" name="zoom" id="zoom" placeholder="optional">
      <br>

      <button type="submit">Create</button>
    </form>
  </div>`);

  const createForm = document.getElementById('create-form');
  createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveNewDetail();
  });
}

function createRefID() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let refID = '';

  for (let i = 0; i < 11; i++) {
    refID += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return refID;
}

function validateRefID() {
  const masterDetails = getMasterDetails();
  const refID = createRefID();

  if (masterDetails == null) return refID;

  for (let i = 0; i < masterDetails.length; i++) {
    if (masterDetails[i].refID === refID) {
      return validateRefID();
    }
  }

  return refID;
}

function filterDetails() {
  const masterDetails = getMasterDetails();
  const query = document.getElementById('filter').value;
  let filteredDetails = [];

  masterDetails.forEach(detail => {
    for (const key in detail) {
      if (detail.hasOwnProperty.call(detail, key)) {
        if (detail[key].toString().toLowerCase().includes(query.toLowerCase())) {
          if (key == 'zoom' || key == 'refID') return;
          filteredDetails.push(detail);
        }
      }
    }
  });

  let uniqueFilteredDetails = [... new Set(filteredDetails)];
  renderDetails(uniqueFilteredDetails);
}

function renderDetail(detail) {
  const detailContainer = document.createElement('div');
  const masterDetails = getMasterDetails();
  detailContainer.className = 'detail';
  masterDetails.forEach(masterDetail => {
    if (masterDetail.refID === detail.refID) {
      const index = masterDetails.findIndex(searchDetail => searchDetail.refID === detail.refID);
      detailContainer.id = `detail-${index}`;
    }
  });

  const nameEl = document.createElement('h3');
  nameEl.textContent = detail.name;

  const idEl = document.createElement('p');
  idEl.textContent = `ID: ${indentIDSpacing(detail.id)}`;

  const passcodeEl = document.createElement('p');
  passcodeEl.textContent = `Passcode: ${detail.passcode}`;

  const iconsContainer = document.createElement('div');
  iconsContainer.className = 'icons';

  const copyEl = document.createElement('i');
  copyEl.className = 'fa-solid fa-clipboard utilities';
  copyEl.addEventListener('click', () => {
    copyDetail({
      name: detail.name,
      id: detail.id,
      passcode: detail.passcode,
    });
    copyEl.className = 'fa-solid fa-check';
    copyEl.style.color = 'rgb(92, 136, 27)';
  });

  const editEl = document.createElement('i');
  editEl.className = 'fa-solid fa-pen-to-square utilities';
  editEl.addEventListener('click', () => {
    editDetail(detail);
  });

  const tagsEl = document.createElement('i');
  tagsEl.className = 'fa-solid fa-tag utilities';
  tagsEl.addEventListener('click', () => {
    renderTagScreen(detail);
  });

  const zoomEl = document.createElement('i');
  const zoomElForm = document.createElement('form');
  const zoomElBtn = document.createElement('button');
  zoomElForm.action = detail.zoom;
  zoomElForm.target = 'blank';
  zoomElBtn.type = 'submit';
  zoomElBtn.style.all = 'unset';
  zoomEl.className = 'fa-solid fa-video utilities';

  const deleteEl = document.createElement('i');
  deleteEl.className = 'fa-solid fa-trash-can utilities';
  deleteEl.addEventListener('click', () => {
    deleteDetail(detail.refID);
  });

  detailContainer.append(nameEl);
  detailContainer.append(idEl);
  detailContainer.append(passcodeEl);
  iconsContainer.append(copyEl);
  iconsContainer.append(editEl);
  iconsContainer.append(tagsEl);
  zoomElBtn.append(zoomEl);
  zoomElForm.append(zoomElBtn);
  detail.zoom !== '' && iconsContainer.append(zoomElForm);
  iconsContainer.append(deleteEl);
  detailContainer.append(iconsContainer);
  document.querySelector('.details-container').append(detailContainer);
}

function deleteDetail(refID) {
  const masterDetails = getMasterDetails();
  const index = masterDetails.findIndex(detail => detail.refID === refID);
  masterDetails.splice(index, 1);
  localStorage.setItem('masterDetails', JSON.stringify(masterDetails));
  renderDetails(masterDetails);
}

function sortDetailsAlphabetically(detailsArr) {
  let alphabeticallySortedDetails = detailsArr.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  return alphabeticallySortedDetails;
}

function copyDetail(detail) {
  const string = `ID: ${indentIDSpacing(detail.id)}
Passcode: ${detail.passcode}`;

  navigator.clipboard.writeText(string);
}

function setFoundCount(detailsArr) {
  const foundEl = document.getElementById('found');
  if (detailsArr == null || !detailsArr.length) {
    foundEl.innerHTML = 0;
    foundEl.style.color = 'red';
  } else {
    foundEl.textContent = detailsArr.length;
    foundEl.style.color = 'green';
  }
}

function isHTTPURL(url) {
  let testURL;

  try {
    testURL = new URL(url);
  } catch (_) {
    return false;
  }

  return testURL.protocol === "http:" || testURL.protocol === "https:";
}

function fixURL(url) {
  if (url === '') return url;
  if (isHTTPURL(url)) return url;

  let prefix = 'https://';
  return prefix += url;
}

function indentIDSpacing(id) {
  let str = id.toString().replace(/\s/g, '').split('');

  if (str.length == 11) {
    str.splice(3, 0, ' ');
    str.splice(8, 0, ' ');
    return str.join('');
  } else {
    str.splice(3, 0, ' ');
    str.splice(7, 0, ' ');
    return str.join('');
  }
}

function getMasterDetails() {
  return JSON.parse(localStorage.getItem('masterDetails'));
}

document.getElementById('filter').addEventListener('input', filterDetails);