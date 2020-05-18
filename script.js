const headers = { Authorization: "Basic " + btoa("5182N78dxnDwgjP1Jg") };

let tickets_loaded = false;
async function view_ticket_list() {
  if (tickets_loaded) return;
  let url =
    "https://johnspyboy.freshdesk.com/api/v2/tickets?include=description,requester";
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
        e["priority"]
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
  priority_no
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
  card.innerHTML = `
  <div class="card-header " >
  <div class="d-inline-flex justify-content-between" style="width:100%" >
   <p>${requester["name"]} </p><p class=" ${
    priority[priority_no][0]
  } rounded text-white p-2">priority : ${priority[priority_no][1]}</p>
  </div>
  <small>${requester["email"]}</small>
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
            <label for="Details${Id}" class="col col-form-label">Details</label>
            <input type="text" class="form-control" id="Details${Id}">
            </div>
            <div class="form-group row">
            <label for="Priority${Id}"class="col col-form-label">Priority</label>
             <select class="custom-select mr-sm-2" id="Priority${Id}">
                <option selected>Select Priority</option>
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
                <option value="4">Urgent</option>
            </select>
            </div>
            <div class="form-group row text-center">
            <button type="btn" class="btn btn-success mr-3" onclick="update_ticket(${Id},'${description}',${priority_no})">Update</button>
            <p>OR</p>
            <button type="btn" class="btn btn-danger ml-3" onclick="delete_ticket(${Id})">Delete</button>
            </div>
        </form>
        </div>
    </div>
  </div>`;
  return card;
}

async function update_ticket(ticketId, def_description, def_priority) {
  let url = "https://johnspyboy.freshdesk.com/api/v2/tickets/" + ticketId;
  let priority = document.getElementById(`Priority${ticketId}`).value;
  priority = priority ? priority : def_priority;
  let details = document.getElementById(`Details${ticketId}`).value;
  details = details ? details : def_description;
  let formData = new FormData();
  formData.append("priority", priority);
  formData.append("description", details);
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
  location.reload();
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
  location.reload();
}

view_ticket_list();
