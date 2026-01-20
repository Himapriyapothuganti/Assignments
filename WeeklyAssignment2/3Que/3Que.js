const customers = [ 
  { id: 1, name: "Ravi", age: 32, policy: "Health", premium: 4800, active: true }, 
  { id: 2, name: "Anita", age: 51, policy: "Life", premium: 12000, active: true }, 
  { id: 3, name: "Kiran", age: 28, policy: "Vehicle", premium: 3500, active: false }, 
  { id: 4, name: "Meena", age: 45, policy: "Health", premium: 6000, active: true }, 
  { id: 5, name: "Suresh", age: 60, policy: "Life", premium: 18000, active: false } 
]; 


// Question 1 – Loop Output Issue
// for (let i = 0; i <= customers.length; i++) {
//   console.log(customers[i].name);
// }

for (let i = 0; i < customers.length; i++) {
  console.log(customers[i].name);
}


// Question 2 – filter() Not Working
// const activeCustomers = customers.filter((c) => {
//   c.active === true;
// });

const activeCustomers = customers.filter((c) => {
  return c.active === true;
});




// Question 3 – Premium Increase Logic Broken
// const updatedPremiums = customers.map((c) => {
//   if (c.age >= 50) {
//     c.premium = c.premium * 1.1;
//   }
// });

const updatedPremiums = customers.map((c) => {
  if (c.age >= 50) {
    return { ...c, premium: c.premium * 1.1 };
  }
  return c;
});


// Question 4 – Wrong Total Premium Calculation
// const totalPremium = customers.reduce((total, c) => {
//   total + c.premium;
// }, 0);

const totalPremium = customers.reduce((total, c) => {
  return total + c.premium;
}, 0);


// Question 5 – Template Literal Not Printing
// console.log("Customer ${customers[0].name} has policy ${customers[0].policy}");

console.log(`Customer ${customers[0].name} has policy ${customers[0].policy}`);


// Question 6 – Policy Count Incorrect
// const policyCount = customers.reduce((count, c) => {
//   count.policy = (count.policy || 0) + 1;
//   return count;
// }, {});

const policyCount = customers.reduce((count, c) => {
  count[c.policy] = (count[c.policy] || 0) + 1;
  return count;
}, {});


// Question 7 – Risk Level Always Undefined
// const customersWithRisk = customers.map((c) => {
//   let riskLevel;
//   if (c.age < 35) riskLevel = "Low";
//   if (c.age <= 50) riskLevel = "Medium";
//   else riskLevel = "High";
//   return { ...c, riskLevel };
// });

const customersWithRisk = customers.map((c) => {
  let riskLevel;
  if (c.age < 35) riskLevel = "Low";
  else if (c.age <= 50) riskLevel = "Medium";
  else riskLevel = "High";

  return { ...c, riskLevel };
});


// Question 8 – Active vs Inactive Count Wrong
// for (const c in customers) {
//   if (c.active) active++;
//   else inactive++;
// }

let active = 0, inactive = 0;
for (const c of customers) {
  if (c.active) active++;
  else inactive++;
}


// Question 9 – Arrow Function Syntax Error
// const getLifeCustomers = () =>
//   customers.filter((c) => c.policy === "Life").map((c) => c.name);

const getLifeCustomers = () => {
  return customers
    .filter((c) => c.policy === "Life")
    .map((c) => c.name);
};


// Question 10 – Sorting Mutates Original Array
// const sortedCustomers = customers.sort((a, b) => b.premium - a.premium);

const sortedCustomers = [...customers].sort((a, b) => b.premium - a.premium);
