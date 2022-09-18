"use strict";
const myform = document.querySelector(".my-form");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const userList = document.getElementById("users");
const msg = document.querySelector(".msg");
const body = document.querySelector("body");
const btn = document.querySelector(".btn");
const btndel = document.querySelector(".del");
const btnedit = document.querySelector(".edit");
let editing = false;
let editingLi;

// on DOM loading
window.addEventListener("DOMContentLoaded", getDataOnLoad);

// delete
userList.addEventListener("click", deteteData);

// edit
userList.addEventListener("click", editData);

// submit
btn.addEventListener("click", submit);

//show msg function
function showMsg(message, type) {
  msg.textContent = message;
  msg.classList.add(type);
  setTimeout(() => {
    msg.classList.remove(type);
    msg.textContent = "";
  }, 2000);
}

// show output on frontend
function showData(obj) {
  const createTextNode = `<li class="listItem"  id="${obj.id}">${obj.amount}-${obj.category}-${obj.description}<button class="btn1 del">Delete</button><button class="btn1 edit">Edit</button></li>`;
  userList.innerHTML += createTextNode;
}

// Add data
function submit(event) {
  event.preventDefault();
  // showing error messege if input is empty
  if (
    amountInput.value === "" ||
    descriptionInput.value === "" ||
    categoryInput.value == ""
  ) {
    showMsg("Please enter all field", "error");
  } else {
    // creating object from user detail
    let obj = {
      amount: amountInput.value,
      category: categoryInput.value,
      description: descriptionInput.value,
    };

    if (editing) {
      //Edit expense
      postPut(`http://localhost:4000/edit-expense/${editingLi.id}`, "put", obj);
    } else {
      //Add expense
      postPut(`http://localhost:4000/add-expense`, "post", obj);
    }
  }
}

// Show data on reload
function getDataOnLoad() {
  getDelete(`http://localhost:4000/get-expenses`, "get");
  resetData();
}

// Delete data
function deteteData(e) {
  if (e.target.classList.contains("del")) {
    resetData();
    if (confirm("Are You Sure?")) {
      getDelete(
        `http://localhost:4000/delete-expense/${e.target.parentElement.id}`,
        "delete"
      );
      userList.removeChild(e.target.parentElement);
    }
  }
}

//Edit data
function editData(e) {
  if (e.target.classList.contains("edit")) {
    editingLi = e.target.parentElement;
    editing = true;
    btn.value = "Edit expense";
    let arr = editingLi.firstChild.textContent.split("-");
    amountInput.value = arr[0];
    categoryInput.value = arr[1];
    descriptionInput.value = arr[2];
  }
}

//reset Data
function resetData() {
  amountInput.value = "";
  descriptionInput.value = "";
  categoryInput.value = "";
  editing = false;
  btn.value = "Add expense";
}

// async function for get and delete request
async function getDelete(requestURL, requestType) {
  try {
    const response = await axios({
      method: requestType,
      url: requestURL,
    });
    if (requestType == "get") {
      for (let i = 0; i < response.data.length; i++) {
        showData(response.data[i]);
      }
    } else {
      showMsg("Deleted", "edited");
    }
  } catch (err) {
    showMsg(err.message, "error");
  }
}

//async function for post and put request
async function postPut(requestURL, requestType, obj) {
  try {
    const response = await axios({
      method: requestType,
      url: requestURL,
      data: obj,
    });
    if (requestType == "put") {
      showMsg("Expense edited", "edited");
      editingLi.firstChild.textContent = `${obj.amount}-${obj.category}-${obj.description}`;
    } else {
      showMsg("Expense added", "success");
      showData(response.data);
    }
    resetData();
  } catch (err) {
    showMsg(err.message, "error");
  }
}
