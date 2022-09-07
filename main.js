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
const APIendpoint = "https://crudcrud.com/api/26d25124b882440693f15e1977744889";
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
  const createTextNode = `<li class="listItem"  id="${obj._id}">${obj.amount}-${obj.category}-${obj.description}<button class="btn1 del">Delete</button><button class="btn1 edit">Edit</button></li>`;
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
      axios
        .put(`${APIendpoint}/Expenses/${editingLi.id}`, obj)
        .then((res) => {
          // showing success messege on editing
          showMsg("Expense edited", "success");
          editingLi.firstChild.textContent = `${obj.amount}-${obj.category}-${obj.description}`;
          resetData();
        })
        .catch((err) => showMsg(err.message, "error"));
    } else {
      //Add expense
      axios
        .post(`${APIendpoint}/Expenses`, obj)
        .then((res) => {
          // showing success messege on submitting
          showMsg("Expense added", "success");
          showData(res.data);
          resetData();
        })
        .catch((err) => showMsg(err.message, "error"));
    }
  }
}

// Show data on reload
function getDataOnLoad() {
  axios
    .get(`${APIendpoint}/Expenses`)
    .then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        showData(res.data[i]);
      }
    })
    .catch((err) => showMsg(err.message, "error"));
  resetData();
}

// Delete data
function deteteData(e) {
  if (e.target.classList.contains("del")) {
    resetData();
    if (confirm("Are You Sure?")) {
      axios
        .delete(`${APIendpoint}/Expenses/${e.target.parentElement.id}`)
        .then(() => {
          showMsg("Deleted", "success");
          userList.removeChild(e.target.parentElement);
        })
        .catch((err) => showMsg(err.message, "error"));
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
