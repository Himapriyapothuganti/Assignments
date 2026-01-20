// Task 1: Fetch Insurance Policies (Fetch + Async/Await) 
//  Fetch policy data from a mock API (simulate API using local data) 
//  Handle API errors using try/catch 
// Use Local Data:

console.log("Script loaded");

const apiURL = "https://696719dfbbe157c088b0da42.mockapi.io/policies/policies";
let policies = [];

// ---------------- TASK 1 ----------------
async function fetchPolicies() {
  try {
    console.log("Fetching policies...");
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error("Network error");
    }

    const data = await response.json();
    policies = data;
    console.log("Policies Loaded:", policies);
  } catch (error) {
    console.log("Error fetching policies:", error.message);
  }
}

// Task 2: Display Policies (Objects & Arrays) 
//  Render policies dynamically on UI 
//  Show: Policy Name, Type, Premium, Duration, Status

// ---------------- TASK 2 ----------------
function displayPolicies() {
  const container = document.getElementById("policiesContainer");
  container.innerHTML = "";

  policies.forEach(policy => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${policy.name}</h3>
      <p>Type: ${policy.type}</p>
      <p>Premium: ₹${policy.premium}</p>
      <p>Duration: ${policy.duration} year(s)</p>
      <p>Status: ${policy.status}</p>
      <hr>
    `;

    container.appendChild(div);
  });
}

// Task 3: Filter Policies (filter) 
//  Filter policies: Health, Life, Vehicle

// Task 4: Calculate Total Premium (reduce) 
//  Calculate total premium of Active policies

// Task 5: Premium Discount Logic (map) 
//  Apply 10% discount to policies above ₹10,000

// Task 6: Policy Approval Simulation (Callback + setTimeout)
//  Simulate policy approval after 2 seconds
//  Use callback pattern

// ---------------- TASK 6 ----------------
function approvePolicyCallback(policy, callback) {
  setTimeout(() => {
    callback(`Policy "${policy.name}" approved successfully (Callback)`);
  }, 2000);
}

// Task 7: Promise-based Policy Purchase
//  Convert callback logic to Promise
//  Handle success & failure

// ---------------- TASK 7 ----------------
function approvePolicyPromise(policy) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (policy) {
        resolve(`Policy "${policy.name}" approved successfully (Promise)`);
      } else {
        reject("Invalid policy");
      }
    }, 2000);
  });
}

// Task 8: Error Handling
//  Invalid policy ID
//  API failure
//  Premium calculation error

// ---------------- TASK 8 ----------------
function findPolicyById(id) {
  try {
    const policy = policies.find(p => p.id == id);
    if (!policy) {
      throw new Error("Policy not found");
    }
    console.log("Policy Found:", policy);
  } catch (error) {
    console.log("Error:", error.message);
  }
}

function calculatePremiumSafe() {
  try {
    const total = policies.reduce((sum, p) => {
      if (typeof p.premium !== "number") {
        throw new Error("Invalid premium value");
      }
      return sum + p.premium;
    }, 0);
    console.log("Total Premium:", total);
  } catch (error) {
    console.log("Calculation Error:", error.message);
  }
}


async function startApp() {
  await fetchPolicies();
  displayPolicies();

  // Task 3 — Filter
  console.log("Health Policies:", policies.filter(p => p.type === "Health"));
  console.log("Life Policies:", policies.filter(p => p.type === "Life"));
  console.log("Vehicle Policies:", policies.filter(p => p.type === "Vehicle"));

  // Task 4 — Total Active Premium
  const totalActivePremium = policies
    .filter(p => p.status === "Active")
    .reduce((sum, p) => sum + p.premium, 0);
  console.log("Total Active Premium:", totalActivePremium);

  // Task 5 — Discount
  const discountedPolicies = policies.map(p =>
    p.premium > 10000 ? { ...p, premium: p.premium * 0.9 } : p
  );
  console.log("Discounted Policies:", discountedPolicies);

  // Task 6 — Callback approval
  approvePolicyCallback(policies[0], msg => console.log(msg));

  // Task 7 — Promise approval
  approvePolicyPromise(policies[1])
    .then(msg => console.log(msg))
    .catch(err => console.log("Error:", err));

  // Task 8 — Error handling tests
  findPolicyById(100);
  calculatePremiumSafe();
}

startApp();
