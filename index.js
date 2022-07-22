const theadEl = document.querySelector('thead');
const tbodyEl = document.querySelector('tbody');
const categoryBtn = document.querySelector('.category-btn');

const remarksColors = {
  'Boarding': '#00FF00',
  'closed': '#FF0000',
  'departed': '#FF0000',
  'ready for Boarding': '#FFFF00',
  'on position': '#FFFF00',
  'baggage delivery': '#FF0000',
  'landed': '#00FF00',
};

const arrivals = data.filter((item) => !item.gate);
const departures = data.filter((item) => item.gate);

const getTime = (val) => {
  const date = new Date(val);
  const hours = date.getHours();
  const mins = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${mins}`;
};

const renderTable = () => {
  if (categoryBtn.textContent === 'Departures') {
    createTbodyContent(departures);
  } else {
    createTbodyContent(arrivals);
  }
  createTheadContent();
};

const highlightRemarks = () => {
  const tbodyRows = document.querySelectorAll('.tbody-row');

  tbodyRows.forEach((row) => {
    row.lastChild.style.color = remarksColors[row.lastChild.textContent];
  });
};

const createTheadContent = () => {
  if (theadEl.children.length) {
    theadEl.replaceChildren();
  }

  const trow = document.createElement('tr');

  theadEl.appendChild(trow);

  const theaderCells = adaptThead();

  theaderCells.forEach((cell) => {
    const theaderEl = document.createElement('th');
  
    trow.appendChild(theaderEl);
    theaderEl.textContent = cell;
  })
};

const adaptThead = () => {
  let theaderCells;

  if (window.matchMedia('(max-width: 520px)').matches) {
    theaderCells = ['Time', 'Destination', 'Remarks'];
  } else if (window.matchMedia('(max-width: 768px)').matches) {
    if (categoryBtn.textContent === 'Departures') {
      theaderCells = ['Time', 'Destination', 'Flight / Gate', 'Remarks'];
    } else {
      theaderCells = ['Time', 'Destination / Flight', 'Remarks'];
    }
  } else {
    if (categoryBtn.textContent === 'Departures') {
      theaderCells = ['Time', 'Destination', 'Flight', 'Gate', 'Remarks'];
    } else {
      theaderCells = ['Time', 'Destination', 'Flight', 'Remarks'];
    }
  }

  return theaderCells;
};

createTheadContent();

const createTbodyContent = (category) => {
  if (tbodyEl.children.length) {
    tbodyEl.replaceChildren();
  }

  category.forEach((item) => {
    const trow = document.createElement('tr');
    
    trow.className = 'tbody-row';
    tbodyEl.appendChild(trow);

    const tbodyCells = adaptTbody(item);
    
    tbodyCells.forEach((cell) => {
      const tdata = document.createElement('td');
  
      tdata.textContent = cell;
      trow.appendChild(tdata);
    })
  })

  highlightRemarks();
}

const adaptTbody = (item) => {
  let tbodyCells;

  if (window.matchMedia('(max-width: 520px)').matches) {
    tbodyCells = [getTime(item.sched), item.apname, item.status];
  } else if (window.matchMedia('(max-width: 768px)').matches) {
    if (categoryBtn.textContent === 'Departures') {
      tbodyCells = [getTime(item.sched), item.apname, `${item.fnr} / ${item.gate}`, item.status];
    } else {
      tbodyCells = [getTime(item.sched), `${item.apname} / ${item.fnr}`, item.status];
    }
  } else {
    if (categoryBtn.textContent === 'Departures') {
      tbodyCells = [getTime(item.sched), item.apname, item.fnr, item.gate, item.status];
    } else {
      tbodyCells = [getTime(item.sched), item.apname, item.fnr, item.status];
    }
  }

  return tbodyCells;
};


categoryBtn.addEventListener('click', () => {
  if (categoryBtn.textContent === 'Departures') {
    categoryBtn.textContent = 'Arrivals';
  } else {
    categoryBtn.textContent = 'Departures';
  }
  
  renderTable();
});

renderTable();

const sortTable = (category, theaderEl) => {
  switch (theaderEl.textContent) {
    case 'Time':
      category.sort((a, b) => new Date(a.sched) - new Date(b.sched));
      break;
    case 'Destination':
    case 'Destination / Flight':
      category.sort((a, b) => a.apname.localeCompare(b.apname));
      break;
    case 'Flight':
    case 'Flight / Gate':
      category.sort((a, b) => a.fnr.localeCompare(b.fnr));
      break;
    case 'Gate':
      category.sort((a, b) => a.gate.localeCompare(b.gate));
      break;
    case 'Remarks':
      category.sort((a, b) => a.status.localeCompare(b.status));
    default:
      break;
  }
};

theadEl.addEventListener('click', (e) => {
  if (categoryBtn.textContent === 'Departures') {
    sortTable(departures, e.target);
    createTbodyContent(departures);
  } else {
    sortTable(arrivals, e.target);
    createTbodyContent(arrivals);
  }
});

window.addEventListener('resize', () => {
  if (
    window.matchMedia('(max-width: 1000px)').matches ||
    window.matchMedia('(max-width: 768px)').matches ||
    window.matchMedia('(max-width: 520px)').matches
    ) {
    renderTable();
  }
});
