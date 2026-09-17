async function run() {
  try {
    const res = await fetch("http://localhost:4000/api/v1/dashboards/operator/notifications");
    const data = await res.json();
    console.log("GET /operator/notifications API Output:");
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
