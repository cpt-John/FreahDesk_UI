async function login() {
  let domain = document.getElementById("domain").value;
  if (!domain) return;
  let apikey = document.getElementById("apikey").value;
  if (!apikey) return;

  let base_url = `https://${domain}.freshdesk.com/api/v2/`;
  let headers = { Authorization: "Basic " + btoa(apikey) };

  let url = base_url + "tickets";
  let data = await fetch(url, {
    method: "GET",
    headers,
  }).catch((error) => {
    throw ("Error:", error);
  });

  if (data.status != 200) {
    alert("invalid credentials");
    console.log(await data.json());
  } else {
    window.location.href = `./admin.html?domain=${domain}&apiKey=${apikey}`;
  }
}
