
function PhoneDirectory() {
  this.contactsList = [...contactsList];
  this.sortType = 1;
}

PhoneDirectory.prototype.isvalid = function (name, mobile, email) {
  if (!name || !email || !mobile) {
   return false;
  }
  const nameRegex = new RegExp('^[a-zA-Z ]*$');
  const mobileRegex = new RegExp('^[0-9]*$');
  const validName = nameRegex.test(name) && name.length <= 20;
  const validMobile = mobileRegex.test(mobile) && mobile.length === 10;
  const validEmail = email.endsWith('@xyzcompany.com') && email.length <= 40;
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
