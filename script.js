// let apiKey = "5182N78dxnDwgjP1Jg";
// let domainName = "johnspyboy";

let url = new URL(window.location.href);
const domainName = window.localStorage.getItem("domain");
const apiKey = window.localStorage.getItem("api_key");
let base_url = `https://${domainName}.freshdesk.com/api/v2/`;
const headers = { Authorization: "Basic " + btoa(apiKey) };

let contacts = [];
let tickets = [];
login();

async function view_ticket_list() {
  let conn_status = true;
  let url = base_url + "tickets?include=description,requester&order_by=status";
  let data = await fetch(url, {
    method: "GET",
    headers,
  }).catch((error) => {
    custom_alert("danger", "ERROR: Cannot connect to server");
    console.error("Error:", error);
    conn_status = false;
  });

  if (!conn_status) return;
  if (data.status != 200) {
    let error = await data.json();
    custom_alert("danger", "ERROR:" + error["errors"][0]["message"]);
    console.error(error);
    return;
  }

  let parsedData = await data.json();

  console.log(parsedData);
  let ticketList = document.getElementById("ticket-list");
  tickets = parsedData;
  ticketList.innerHTML = "";
  parsedData.forEach((e) => {
    ticketList.appendChild(
      create_ticket_card(
        e["id"],
        e["requester"],
        e["subject"],
        e["description_text"],
        e["due_by"],
        e["priority"],
        e["status"]
      )
    );
  });
}

function create_ticket_card(
  Id,
  requester,
  subject,
  description,
  dueDate,
  priority_no,
  status_no
) {
  description = description ? description : "no details";
  let card = document.createElement("div");
  card.className = "card m-2 ";
  card.style.width = "20em";
  let priority = {
    1: ["bg-success", "low"],
    2: ["bg-primary", "medium"],
    3: ["bg-warning", "high"],
    4: ["bg-danger", "urgent"],
  };
  let status = {
    2: "open",
    3: "pending",
    4: "resolved",
    5: "closed",
    6: "waiting for customer",
    7: "waiting for third-party",
  };
  card.innerHTML = `
  <div class="card-header " >
  <div class="d-inline-flex justify-content-between" style="width:100%" >
   <div><p>${requester["name"]} </p></div><div><p class=" ${
    priority[priority_no][0]
  } rounded text-white p-2">priority : ${priority[priority_no][1]}</p></div>
  </div>
  <small><u>Status: ${status[status_no]}</u></small><br/>
  <small class=" text-dark font-italic py-1 px-2">${requester["email"]}</small>
  </div>
  
  <div class="card-body">
    <h5 class="card-title">${subject}</h5>
   
    <p class="card-text">Due Date : ${new Date(dueDate).toDateString()}</p><br/>
    <a href="#" class="btn btn-primary mb-1" data-toggle="collapse" data-target="#collapse${Id}" aria-expanded="false" aria-controls="collapse${Id}">More</a>
    <div class="collapse mt-2" id="collapse${Id}">
        <div class="card card-body">
        <p>Details:</p>
        <p style="max-height:150px; overflow-y: scroll; ">"${description}"</p>
        <div>
           
            <div class="form-group row">
            <label for="Priority${Id}"class="col col-form-label">Priority</label>
             <select class="custom-select mr-sm-2" id="Priority${Id}">
             <option value="" selected> Select Priority</option>
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
                <option value="4">Urgent</option>
            </select>
            </div>
            <div class="form-group row">
            <label for="Status${Id}"class="col col-form-label">Status</label>
             <select class="custom-select mr-sm-2" id="Status${Id}">
             <option value="" selected>Select Status</option>
                <option value="2">Open</option>
                <option value="3">Pending</option>
                <option value="4">Resolved</option>
                <option value="5">Closed</option>
                <option value="6">Waiting for Customer</option>
                <option value="7">Waiting for Third-party</option>
            </select>
            </div>
            <div class="form-group row text-center">
            <button type="btn" class="btn btn-success mr-3" onclick="update_ticket(${Id},${priority_no},${status_no})">Update</button>
            <p>OR</p>
            <button type="btn" class="btn btn-danger ml-3" onclick="delete_ticket(${Id})">Delete</button>
            </div>
        </div>
        </div>
    </div>
  </div>`;
  return card;
}

async function update_ticket(ticketId) {
  let conn_status = true;
  let url = base_url + "tickets/" + ticketId;
  let ticket = tickets.find((t) => t["id"] == ticketId);
  let formData = new FormData();
  let priority = document.getElementById(`Priority${ticketId}`).value;
  if (priority) formData.append("priority", priority);
  let status = document.getElementById(`Status${ticketId}`).value;
  if (status) formData.append("status", status);

  let data = await fetch(url, {
    method: "PUT",
    headers,
    body: formData,
  }).catch((error) => {
    custom_alert("danger", "ERROR: Cannot connect to server");
    console.error("Error:", error);
    conn_status = false;
  });
  if (!conn_status) return;
  if (data.status != 200) {
    let error = await data.json();
    custom_alert("danger", "ERROR:" + error["errors"][0]["message"]);
    console.error(error);
    return;
  }
  let parsedData = await data.json();
  console.log(parsedData);
  view_ticket_list();
}

async function delete_ticket(ticketId) {
  let conn_status = true;
  let url = base_url + "tickets/" + ticketId;
  await fetch(url, {
    method: "DELETE",
    headers,
  }).catch((error) => {
    custom_alert("danger", "ERROR: Cannot connect to server");
    console.error("Error:", error);
    conn_status = false;
  });
  if (!conn_status) return;
  custom_alert("warning", "deleted!");
  console.log("ticket deleted");
  view_ticket_list();
}

// contacts tab
async function view_contacts_list() {
  let conn_status = true;
  let url = base_url + "contacts";
  let data = await fetch(url, {
    method: "GET",
    headers,
  }).catch((error) => {
    custom_alert("danger", "ERROR: Cannot connect to server");
    console.error("Error:", error);
    conn_status = false;
  });
  if (!conn_status) return;
  if (data.status != 200) {
    let error = await data.json();
    custom_alert("danger", "ERROR:" + error["errors"][0]["message"]);
    console.error(error);
    return;
  }

  let parsedData = await data.json();

  console.log(parsedData);

  contacts = parsedData;

  let contactList = document.getElementById("contacts-list");

  contactList.innerHTML = "";
  parsedData.forEach((e) => {
    contactList.appendChild(
      create_contact_card(e["id"], e["name"], e["email"], e["phone"])
    );
  });
}

function create_contact_card(id, name, email, phone) {
  phone = phone ? phone : "---";
  let card = document.createElement("tr");
  card.innerHTML = `<th scope="row">${id}</th>
      <td id='name${id}'>${name}</td>
      <td id='email${id}'>${email}</td>
      <td id='phone${id}'>${phone}</td>
      <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#update-contact" onclick="fill_contact_details(${id})">
  Update Contact
</button></td>`;
  return card;
}

function fill_contact_details(Id) {
  document.getElementById("update-btn").setAttribute("contactId", Id);
  let contact = contacts.find((c) => c["id"] == Id);
  document.getElementById("contact-id").value = contact["id"];
  document.getElementById("update-name").value = contact["name"];
  document.getElementById("update-email").value = contact["email"];
  document.getElementById("update-phone").value = contact["phone"];
  document.getElementById("update-twitter").value = contact["twitter_id"];
  document.getElementById("update-address").value = contact["address"];
}

async function update_contact(item) {
  let conn_status = true;

  contactId = item.getAttribute("contactId");
  let contact = contacts.find((c) => c["id"] == contactId);
  let formData = new FormData();
  let url = base_url + "contacts/" + contactId;
  let name = document.getElementById("update-name").value;
  if (name != contact["name"] && name) formData.append("name", name);
  let email = document.getElementById("update-email").value;
  if (email != contact["email"] && email) formData.append("email", email);
  let phone = document.getElementById("update-phone").value;
  if (phone != contact["phone"] && phone) formData.append("phone", phone);
  let twitter = document.getElementById("update-twitter").value;
  if (twitter != contact["twitter_id"] && twitter)
    formData.append("twitter_id", twitter);
  let address = document.getElementById("update-address").value;
  if (address != contact["address"] && address)
    formData.append("address", address);

  let data = await fetch(url, {
    method: "PUT",
    headers,
    body: formData,
  }).catch((error) => {
    console.error("Error:", error);
    custom_alert("danger", "ERROR: Cannot connect to server");
    conn_status = false;
  });
  if (!conn_status) return;
  if (data.status != 200) {
    let error = await data.json();
    custom_alert("danger", "ERROR:" + error["errors"][0]["message"]);
    console.error(error);
    return;
  }

  let parsedData = await data.json();
  custom_alert("success", "Upadted Contact!");
  console.log(parsedData);
  view_contacts_list();
}

async function delete_contact() {
  let conn_status = true;
  let Id = document.getElementById("contact-id").value;
  let url = base_url + "contacts/" + Id + "/hard_delete?force=true";
  let data = await fetch(url, {
    method: "DELETE",
    headers,
  }).catch((error) => {
    console.error("Error:", error);
    custom_alert("danger", "ERROR: Cannot connect to server");
    conn_status = false;
  });

  if (!conn_status) return;
  custom_alert("warning", "deleted!");
  console.log("constact deleted");
  view_contacts_list();
}

async function create_ticket() {
  let conn_status = true;
  let url = base_url + "tickets/";
  let formData = new FormData();
  let email = document.getElementById("email-create-ticket").value;
  let subject = document.getElementById("subject-create").value;
  let priority = document.getElementById("priority-create").value;
  let status = document.getElementById("status-create").value;
  let details = document.getElementById("details-create").value;
  formData.append("email", email);
  formData.append("subject", subject);
  formData.append("description", details);
  formData.append("status", status);
  formData.append("priority", priority);
  let data = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  }).catch((error) => {
    console.error("Error:", error);
    custom_alert("danger", "ERROR: Cannot connect to server");
    conn_status = false;
  });

  if (!conn_status) return;

  if (data.status != 201) {
    let error = await data.json();
    custom_alert("danger", "ERROR:" + error["errors"][0]["message"]);
    console.error(error);
    return;
  }

  let parsedData = await data.json();
  custom_alert("success", "ticket created!");
  console.log(parsedData);
  view_ticket_list();
  view_contacts_list();
}

async function create_contact() {
  let conn_status = true;
  let url = base_url + "contacts/";
  let formData = new FormData();
  let email = document.getElementById("email-create-contact").value;
  let name = document.getElementById("name-create").value;
  let phone = document.getElementById("phone-create").value;
  let twitter = document.getElementById("twitter-create").value;
  let address = document.getElementById("address-create").value;
  phone = phone ? phone : "---";
  formData.append("email", email);
  formData.append("name", name);
  formData.append("phone", phone);
  formData.append("twitter_id", twitter);
  formData.append("address", address);
  let data = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  }).catch((error) => {
    console.error("Error:", error);
    custom_alert("danger", "ERROR: Cannot connect to server");
    conn_status = false;
  });
  if (!conn_status) return;
  if (data.status != 201) {
    let error = await data.json();
    custom_alert("danger", "ERROR:" + error["errors"][0]["message"]);
    console.error(error);
    return;
  }

  let parsedData = await data.json();
  console.log(parsedData);
  custom_alert("success", "contact created!");
  view_contacts_list();
}

function login() {
  if (!(apiKey || domainName)) {
    custom_alert("warning", "not logged in!");
    setTimeout(() => {
      window.location.href = "./login.html";
    }, 2000);
  } else {
    custom_alert("success", "logged in!");
    view_ticket_list();
    view_contacts_list();
  }
}
function logOut() {
  window.localStorage.removeItem("domain");
  window.localStorage.removeItem("api_key");
  custom_alert("warning", "logged out!");
  setTimeout(() => (window.location.href = "./login.html"), 2000);
}

function custom_alert(type, message) {
  let newAlert = $("#alert");
  newAlert.html(`
  <div class="alert alert-${type} alert-dismissible fade show" role="alert">
  <strong>${message}</strong></br>check console for more
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
  </div>`);
  $("html, body").animate(
    {
      scrollTop: $("#alert").offset().top,
    },
    500
  );
  setTimeout(() => {
    newAlert.html("");
  }, 3000);
}
function suggestContacts() {
  $("#suggestion-list").empty();
  let val = $("#email-create-ticket").val();
  if (!val) return;
  let regex = new RegExp(`^${val}`, "i");
  let suggesionList = contacts
    .filter((contact) => contact["email"].match(regex))
    .map((contact) => contact["email"]);
  suggesionList.forEach((mail) => {
    $("#suggestion-list").append(` <option value="${mail}"></option>`);
  });
}

function scrollToCreateContact() {
  $("html, body").animate(
    {
      scrollTop: $("#name-create").offset().top,
    },
    500
  );
}
