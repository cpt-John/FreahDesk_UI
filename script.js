// let apiKey = "5182N78dxnDwgjP1Jg";
// let domainName = "johnspyboy";

let url = new URL(window.location.href);
const domainName = url.searchParams.get("domain");
const apiKey = url.searchParams.get("apiKey");
let base_url = `https://${domainName}.freshdesk.com/api/v2/`;
const headers = { Authorization: "Basic " + btoa(apiKey) };

async function view_ticket_list() {
  let url = base_url + "tickets?include=description,requester&order_by=status";
  let data = await fetch(url, {
    method: "GET",
    headers,
  }).catch((error) => {
    alert("Request error  more details in console");
    console.error("Error:", error);
  });

  if (data.status != 200) {
    alert("Responce Error more details in console");
    console.error(await data.json());
  }

  let parsedData = await data.json().catch(() => {
    alert("error in data");
    console.error("error in parsing");
    return;
  });
  console.log(parsedData);
  let ticketList = document.getElementById("ticket-list");
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

async function update_ticket(ticketId, def_priority, def_status) {
  let url = base_url + "tickets/" + ticketId;
  let priority = document.getElementById(`Priority${ticketId}`).value;
  priority = priority ? priority : def_priority;
  let status = document.getElementById(`Status${ticketId}`).value;
  status = status ? status : def_status;
  let formData = new FormData();
  formData.append("priority", priority);
  formData.append("status", status);
  let data = await fetch(url, {
    method: "PUT",
    headers,
    body: formData,
  }).catch((error) => {
    alert("Request error  more details in console");
    console.error("Error:", error);
  });
  if (data.status != 200) {
    alert("Responce Error more details in console");
    console.error(await data.json());
  }
  let parsedData = await data.json().catch(() => {
    alert("error in data");
    console.error("error in parsing");
    return;
  });
  console.log(parsedData);
  view_ticket_list();
}

async function delete_ticket(ticketId) {
  let url = base_url + "tickets/" + ticketId;
  let data = await fetch(url, {
    method: "DELETE",
    headers,
  }).catch((error) => {
    alert("Request error  more details in console");
    console.error("Error:", error);
    return;
  });

  console.log("deleted");
  view_ticket_list();
}

// contacts tab
async function view_contacts_list() {
  let url = base_url + "contacts";
  let data = await fetch(url, {
    method: "GET",
    headers,
  }).catch((error) => {
    console.error("Error:", error);
  });

  if (data.status != 200) {
    alert("Responce Error more details in console");
    console.error(await data.json());
  }

  let parsedData = await data.json().catch(() => {
    alert("error in data");
    console.error("error in parsing");
    return;
  });
  console.log(parsedData);
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
  document.getElementById("contact-id").value = Id;
  document.getElementById("update-name").value = document.getElementById(
    "name" + Id
  ).innerText;
  document.getElementById("update-email").value = document.getElementById(
    "email" + Id
  ).innerText;
  document.getElementById("update-phone").value = document.getElementById(
    "phone" + Id
  ).innerText;
}

async function update_contact() {
  let Id = document.getElementById("contact-id").value;
  let url = base_url + "contacts/" + Id;
  let name = document.getElementById("update-name").value;
  name = name ? name : document.getElementById("name" + Id).innerText;
  let email = document.getElementById("update-email").value;
  email = email ? email : document.getElementById("email" + Id).innerText;
  let phone = document.getElementById("update-phone").value;
  phone = phone ? phone : document.getElementById("phone" + Id).innerText;

  let formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("phone", phone);
  let data = await fetch(url, {
    method: "PUT",
    headers,
    body: formData,
  }).catch((error) => {
    console.error("Error:", error);
  });

  if (data.status != 200) {
    alert("Responce Error more details in console");
    console.error(await data.json());
  }

  let parsedData = await data.json().catch(() => {
    alert("error in data");
    console.error("error in parsing");
    return;
  });
  console.log(parsedData);
  view_contacts_list();
}

async function delete_contact() {
  let Id = document.getElementById("contact-id").value;
  let url = base_url + "contacts/" + Id + "/hard_delete?force=true";
  let data = await fetch(url, {
    method: "DELETE",
    headers,
  }).catch((error) => {
    console.error("Error:", error);
    return;
  });

  console.log("deleted");
  view_contacts_list();
}

view_contacts_list();

async function create_ticket() {
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
  });

  if (data.status != 201) {
    alert("Responce Error more details in console");
    console.error(await data.json());
  } else {
    alert("Ticket Created");
  }

  let parsedData = await data.json().catch(() => {
    alert("error in data");
    console.error("error in parsing");
    return;
  });
  console.log(parsedData);
  view_ticket_list();
}

async function create_contact() {
  let url = base_url + "contacts/";
  let formData = new FormData();
  let email = document.getElementById("email-create-contact").value;
  let name = document.getElementById("name-create").value;
  let phone = document.getElementById("phone-create").value;
  phone = phone ? phone : "---";
  formData.append("email", email);
  formData.append("name", name);
  formData.append("phone", phone);
  let data = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  }).catch((error) => {
    console.error("Error:", error);
  });
  console.log(data.status);
  if (data.status != 201) {
    alert("Responce Error more details in console");
    console.error(await data.json());
  } else {
    alert("contact Created");
  }

  let parsedData = await data.json().catch(() => {
    alert("error in data");
    console.error("error in parsing");
    return;
  });
  console.log(parsedData);
  view_contacts_list();
}

view_ticket_list();
