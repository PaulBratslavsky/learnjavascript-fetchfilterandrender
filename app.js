const url = 'https://communityoneapi.herokuapp.com/projects';

const itemsContainer = document.querySelector('.items-container');
const searchField = document.querySelector('.search');
const select = document.querySelector('.select');

function useState() {
  let _state = null;

  function getState() {
    return _state;
  }

  function setState(data) {
    _state = [...data];
  }

  return [getState, setState];
}

const [getState, setState] = useState();

function cardTemplate(data) {
  const { id, name, description, featuredImage, developer } = data;
  return `
    <article class="col items-container">
      <div class="col ">
        <div class="card h-100 data-item-id=${id}">
          <div class="card-header d-flex justify-content-between">
            <span>${developer.firstName}</span> <span>${developer.userType}</span>
          </div>
          <img src="${featuredImage.formats.large.url}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="card-text">${description}</p>
          </div>
        </div>
      </div>
    </article>
  `;
}

function getDeveloperNames(data) {
  const names = data.map((item) => item.developer.firstName);
  const uniqueNames = [...new Set(names)];
  return uniqueNames;
}

async function getData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function handleSearchInputChange(e) {
  const value = e.target.value.toLowerCase();
  const data = getState();
  const filteredItems = data.filter((item) =>
    item.name.toLowerCase().includes(value)
  );
  renderProjectsToDom(filteredItems);
}

function handleSelectInputChange(e) {
  const value = e.currentTarget.value.toLowerCase();
  const data = getState();
  const filteredItems = data.filter((item) =>
    value.toLowerCase() === 'all'
      ? item
      : item.developer.firstName.toLowerCase() === value.toLowerCase()
  );
  renderProjectsToDom(filteredItems);
}

function renderProjectsToDom(data) {
  let items = data.map((item) => cardTemplate(item)).join('');
  itemsContainer.innerHTML = items;
}

function renderSelectItemsToDom(data) {
  let items = ['<option selected value="all">All</option>'];
  data.forEach((item) => {
    items.push(`<option value="${item}">${item}</option>`);
  });
  select.innerHTML = items.join('');
}

async function handleInitialLoad() {
  const data = await getData(url);
  setState(data);

  const devNames = getDeveloperNames(getState());
  renderSelectItemsToDom(devNames);

  renderProjectsToDom(getState());
}

window.addEventListener('DOMContentLoaded', handleInitialLoad);
searchField.addEventListener('keyup', handleSearchInputChange);
select.addEventListener('change', handleSelectInputChange);
