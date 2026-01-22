const API_URL = "http://localhost:5000/api/reports";

/* Navigation */
function showPage(pageId) {
  ["home","report","search","education"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
  document.getElementById(pageId).style.display = "block";
}

/* Load Recent Reports */
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    const reports = document.getElementById("reports");
    data.forEach(r => {
      reports.innerHTML +-= `
        <div class="card">
          <strong>${r.identifierType}</strong>: ${r.identifierValue}<br>
          <em>${r.scamType}</em><br>
          <small>${new Date(r.createdAt).toDateString()}</small>
        </div>
      `;
    });
  });

/* Submit Report */
document.getElementById("reportForm").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target;

  const report = {
    scamType: f.scamType.value,
    identifierType: f.identifierType.value,
    identifierValue: f.identifierValue.value,
    description: f.description.value,
    amountLost: f.amountLost.value,
    district: f.district.value
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report)
  });

  alert("Report submitted successfully");
  f.reset();
  showPage("home");
});

/* Search */
async function searchScam() {
  const q = document.getElementById("query").value;
  const res = await fetch(`${API_URL}/search/${q}`);
  const data = await res.json();

  const results = document.getElementById("results");
  results.innerHTML = "";

  if (data.length === 0) {
    results.innerHTML = "<p>No reports found. Stay cautious.</p>";
    return;
  }

  data.forEach(r => {
    results.innerHTML +-= `
      <div class="card">
        <strong>${r.identifierType}</strong>: ${r.identifierValue}<br>
        <em>${r.scamType}</em><br>
        ${r.description}<br>
        <small>${new Date(r.createdAt).toDateString()}</small>
      </div>
    `;
  });
}

