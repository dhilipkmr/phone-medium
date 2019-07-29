
function PhoneDirectory() {
  this.contactsList = [...contactsList];
  this.sortType = 1;
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

PhoneDirectory.prototype.isvalid = function (name, mobile, email) {
  if (!name || !email || !mobile) {
   return false;
  }
  const nameRegex = new RegExp('^[a-zA-Z ]*$');
  const mobileRegex = new RegExp('^[0-9]*$');
  const validName = nameRegex.test(name) && name.length <= 20;
  const validMobile = mobileRegex.test(mobile) && mobile.length === 10;
  const validEmail = validateEmail(email) && email.length <= 40;
  return validName && validMobile && validEmail;
}

PhoneDirectory.prototype.addNewContact = function(e) {
  e.preventDefault();
  const name = this.$name.value;
  const email = this.$email.value;
  const mobile = this.$mobile.value;
  const isValidInputs = this.isvalid(name, mobile, email);
  this.handleError(isValidInputs);
  if (!isValidInputs) return;
  const values = {
    name, email, mobile
  };
  this.contactsList.push(values);
  this.updateTable(values);
  this.resetInfo();
}

PhoneDirectory.prototype.handleError = function(isValid) {
  if (!isValid) {
    this.$error.classList.remove('dn');
    return;
  }
  this.$error.classList.add('dn');
};

PhoneDirectory.prototype.sort = function() {
  const val1 = this.sortType === 1 ? -1 : 1;
  const val2 = this.sortType === 1 ? 1 : -1;

  const sortedList = this.contactsList.sort((a,b) => {
    if(a.name < b.name) return val1;
    if(a.name > b.name) return val2;
    return 0;
  });
  if (this.sortType === 1) {
    this.sortType = 2;
  } else {
    this.sortType = 1;
  }
  this.reRendertable(sortedList);
}

PhoneDirectory.prototype.reRendertable = function(sortedList) {
  const $heading = this.$tBody.children[0];
  this.$tBody.innerHTML = '';
  this.$tBody.append($heading);
  if (sortedList.length === 0) {
    this.$noResult.classList.remove('dn');
  } else {
    this.$noResult.classList.add('dn');
    sortedList.forEach((val) => {
      this.$tBody.append(this.getCard(val));
    });
  }
}

PhoneDirectory.prototype.updateTable = function(value) {
  const $nextRow = this.getCard(value);
  this.$tBody.appendChild($nextRow);
}

PhoneDirectory.prototype.getCard = function(data) {
  const $tr = document.createElement('tr');
  $tr.innerHTML = `
    <td>${data.name}</td>
    <td>${data.mobile}</td>
    <td>${data.email}</td>
    `;
  return $tr;
};

PhoneDirectory.prototype.resetInfo = function() {
  this.$name.value = '';
  this.$mobile.value = '';
  this.$email.value = '';
}

PhoneDirectory.prototype.searchContact = function() {
  const searchStr = this.$search.value;
  const filteredList = [];
  this.contactsList.forEach((val) => {
    if (val.mobile.indexOf(searchStr) > -1) {
      filteredList.push(val);
    }
  });
  this.reRendertable(filteredList);
}

PhoneDirectory.prototype.initiateEventListeners = function() {
  this.$addContactBtn.addEventListener('click', this.addNewContact.bind(this));
  this.$tName.addEventListener('click', this.sort.bind(this));
  this.$search.addEventListener('keyup', this.searchContact.bind(this));
}

PhoneDirectory.prototype.init = function() {
  this.$name = document.getElementById('name');
  this.$mobile = document.getElementById('mobile');
  this.$email = document.getElementById('email');
  this.$summaryTable = document.getElementById('summaryTable');
  this.$error = document.getElementById('error');
  this.$addContactBtn = document.getElementById('submit');
  this.$tBody = document.querySelector('#summaryTable tbody');
  this.$tName = document.querySelector('#nameColumn');
  this.$search = document.querySelector('#search');
  this.$noResult = document.querySelector('#noResult');
  this.initiateEventListeners();
}

const phoneDirectory = new PhoneDirectory();
phoneDirectory.init();

// function PhoneDirectory() {
//   this.directory = [...contactsList];
//   this.directoryBackup = [...contactsList];
//   this.nameSort = null;
// }
// PhoneDirectory.prototype.submitClick = function(event) {
//   if (this.name && this.name.value && this.mobile && this.mobile.value && this.email && this.email.value) {
//       let item = { name: this.name.value, mobile: this.mobile.value, email: this.email.value };
//       this.directory.push(item);
//       this.directoryBackup = [...this.directory];
//       this.updateTable();
//   } else {
//       this.error.style.display = 'block';
//   }
// }
// PhoneDirectory.prototype.sortByName = function(event) {
//   this.nameSort = (!this.nameSort || this.nameSort === -1) ? 1 : -1;
//   this.directoryBackup = [...this.directory];
//   this.directory = this.directory.sort(compareValues('name', (this.nameSort === 1) ? 'asc' : 'desc'));
//   this.updateTable();
// }
// function compareValues(key, order = 'asc') {
//   return function(a, b) {
//       if (!a.hasOwnProperty(key) ||
//           !b.hasOwnProperty(key)) {
//           return 0;
//       }
//       const varA = (typeof a[key] === 'string') ?
//           a[key].toUpperCase() : a[key];
//       const varB = (typeof b[key] === 'string') ?
//           b[key].toUpperCase() : b[key];
//       let comparison = 0;
//       if (varA > varB) {
//           comparison = 1;
//       } else if (varA < varB) {
//           comparison = -1;
//       }
//       return (
//           (order == 'desc') ?
//           (comparison * -1) : comparison
//       );
//   };
// }
// PhoneDirectory.prototype.searchPhone = function(event) {
//   let key = event.target.value;
//   if (this.directory.length === 0) {
//       this.directory = [...this.directoryBackup];
//   }
//   let searchItems = this.directory.filter((item) => {
//       return item.mobile.includes(key);
//   });
//   if (searchItems.length > 0) {
//       this.directory = [...searchItems];
//       this.noResult.style.display = 'none';
//   } else {
//       this.directory = [];
//       this.noResult.style.display = 'block';
//   }
//   this.updateTable();
// }
// PhoneDirectory.prototype.updateTable = function() {
//   let headerRow = this.summaryTable.querySelector('tr:first-child');
//   this.summaryTable.innerHTML = '';
//   this.summaryTable.appendChild(headerRow);
//   this.directory.forEach(item => {
//       let row = document.createElement('tr'),
//           name = document.createElement('td'),
//           email = document.createElement('td'),
//           mobile = document.createElement('td');
//       name.innerText = item.name;
//       email.innerText = item.email;
//       mobile.innerText = item.mobile;
//       row.appendChild(name);
//       row.appendChild(mobile);
//       row.appendChild(email);
//       this.summaryTable.appendChild(row);
//   })
// }
// PhoneDirectory.prototype.init = function() {
//   this.submitBtn = document.querySelector('#submit');
//   this.name = document.querySelector('#name');
//   this.mobile = document.querySelector('#mobile');
//   this.email = document.querySelector('#email');
//   this.error = document.querySelector('#error');
//   this.noResult = document.querySelector('#noResult');
//   this.summaryTable = document.querySelector('#summaryTable');
//   this.nameColumn = document.querySelector('#nameColumn');
//   this.search = document.querySelector('#search');
//   this.submitBtn.addEventListener("click", this.submitClick.bind(this));
//   this.nameColumn.addEventListener("click", this.sortByName.bind(this));
//   this.search.addEventListener("keyup", this.searchPhone.bind(this));
//   this.updateTable();
// }
// window.addEventListener('DOMContentLoaded', (event) => {
//   var phoneDirectory = new PhoneDirectory();
//   phoneDirectory.init();
// });