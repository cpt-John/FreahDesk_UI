const headers = { Authorization: "Basic " + btoa("5182N78dxnDwgjP1Jg") };

async function view_ticket_list() {
  let url =
    "https://johnspyboy.freshdesk.com/api/v2/tickets?include=description,requester&order_by=status";
  let data = await fetch(url, {
    method: "GET",
    headers,
  }).catch((error) => {
    console.error("Error:", error);
  });

  let parsedData = await data
    .json()
    .catch(() => console.error("error in parsing"));
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
  tickets_loaded = true;
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
        <form>
           
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
        </form>
        </div>
    </div>
  </div>`;
  return card;
}

async function update_ticket(ticketId, def_priority, def_status) {
  let url = "https://johnspyboy.freshdesk.com/api/v2/tickets/" + ticketId;
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
    console.error("Error:", error);
  });
  let parsedData = await data
    .json()
    .catch(() => console.error("error in parsing"));
  console.log(parsedData);
  view_ticket_list();
}

async function delete_ticket(ticketId) {
  let url = "https://johnspyboy.freshdesk.com/api/v2/tickets/" + ticketId;
  let data = await fetch(url, {
    method: "DELETE",
    headers,
  }).catch((error) => {
    console.error("Error:", error);
  });

  console.log("deleted");
  view_ticket_list();
}

view_ticket_list();
