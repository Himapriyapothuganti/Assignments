//Task 1– Select by ID 
//Change the dashboard title text to “Customer Insurance Overview”.

document.getElementById('pageTitle').innerHTML='Customer Insurance Overview';

// Task 2– Select by Tag Name 
// Select all <li> elements and: 
// Add a border 
// Log the total number of customers 

const custlist=document.getElementsByTagName('li');
len=custlist.length;
for(let i=0;i<len;i++){
    custlist[i].style.border='2px solid';
    custlist[i].style.padding='10px';
}
console.log(custlist.length);

// Task 3– Select by Class Name 
// Select all .policy elements and: 
// Add highlight class 
// Change text color to blue

const pol=document.getElementsByClassName('policy');
policylen=pol.length;
for(let i=0;i<policylen;i++){
    pol[i].style.color='blue';
    pol[i].classList.add('highlight');
}

// Task 4– Select using CSS Selectors 
// Select the first customer only 
// Select all customers 
// Mark the last customer as active 

const fc=document.querySelector('.customer');
const custs=document.querySelectorAll('.customer');
for(let i=0;i<len;i++){
    console.log(custs[i].innerText);
}
custlen=custs.length;
custs[custlen-1].classList.add('active');

// Task 5– HTML Object Collections 
// Using document collections: 
// Count number of forms 
// Get number of images 
// Change text of all links to “More Info” 


const noOfForms=document.querySelectorAll('form');
console.log(noOfForms.length);
const noOfImgs=document.querySelectorAll('img');
console.log(noOfImgs.length);
const Links=document.getElementsByTagName('a');
linkslen=Links.length;
for(let i=0;i<linkslen;i++){
    Links[i].innerText='More Info';
}

// Task 6– Add a new customer dynamically and observe: 
// Which selections update automatically? 
// Which don’t?

let el=document.createElement('li');
el.className='customer';
el.textContent='Himapriya -Travel';
document.getElementById('customerList').append(el);

// Task 7 – Attribute-Based Selection 
// Select only input fields whose type is "text" using CSS selectors and: 
// Add a yellow background 
// Add placeholder text: "Enter Full Name" 

let inpf=document.querySelectorAll('input[type="text"]');
for(let i=0;i<inpf.length;i++){
    inpf[i].style.backgroundColor='yellow';
    inpf[i].placeholder='Enter Full Name';
}

// Task 8 – Multiple Class Selection 
// Select all elements that have both customer and active classes and: 
// Change text color to dark green 
// Add text (Priority Customer) at the end 

const mu=document.querySelectorAll('.customer.active');
mu.forEach((i)=>{
i.style.color='darkgreen';
i.textContent+= ' (Priority Customer)';

});

// Task 9 – Descendant vs Child Selector 
// Select all <li> elements inside #customerList using a descendant selector 
// Select only direct child <li> using a child selector 
// Log the difference in console. 

const des=document.querySelectorAll('#customerList li')
const deschild=document.querySelectorAll('#customerList >li');
console.log(des.length);
console.log(deschild.length);

// Task 10 – Even / Odd Selection (CSS Pseudo Selectors) 
// Using querySelectorAll(): 
// Highlight even customers in light gray 
// Highlight odd customers in light blue 
// Hint: :nth-child() 

let ev=document.querySelectorAll('#customerList li:nth-child(even)');
let od=document.querySelectorAll('#customerList li:nth-child(odd)');
ev.forEach((i)=>{
    i.style.color='lightgray';
});
od.forEach((i)=>{
    i.style.color='lightblue';
});

// Task 11 – Form Elements Collection 
// Using HTML form object model: 
// Access the enquiry form 
// Log all input field names 
// Disable the submit button 
// Hint: document.forms["formId"].elements 

let form = document.forms['enquiryForm'];
for (let ip of form.elements) {
  if (ip.tagName === 'INPUT') {
    console.log(ip.name);
  }
}
form.querySelector('button[type="submit"]').disabled = true;

// Task 12 – NodeList vs HTMLCollection 
// Select policies using:
// getElementsByClassName 
// querySelectorAll 
// Dynamically add a new policy 
// Observe which collection updates automatically 

let policyHTMLCollection = document.getElementsByClassName("policy");
let policyNodeList = document.querySelectorAll(".policy");
let newPolicy = document.createElement("p");
newPolicy.className = "policy";
newPolicy.textContent = "Travel Insurance";
document.body.appendChild(newPolicy);
console.log("HTMLCollection updated:", policyHTMLCollection.length);
console.log("NodeList static:", policyNodeList.length);

// Task 13 – Text Content Filtering 
// Select all customers and: 
// Highlight customers whose policy includes "Life" 
// Hide customers whose policy includes "Vehicle" 
// Hint: textContent.includes() 

let customersList = document.querySelectorAll("#customerList li");
customersList.forEach(li => {
    const text = li.textContent;
    if (text.includes("Life")) {
        li.style.backgroundColor = "aqua";
    }
    if (text.includes("Vehicle")) {
        li.style.display = "none";
    }
});

// Task 14 – Closest & Parent Traversal 
// When clicking any customer <li>: 
// Find the nearest <ul> 
// Add a border to it 
// Hint: closest() 

document.querySelectorAll("#customerList li").forEach(li => {
    li.addEventListener("click", () => {
        let ul = li.closest("ul");
        ul.style.border = "3px solid red";
    });
});


// Task 15 – Complex Selector Challenge Select: 
// All policy <p> elements except the first one and: 
// Change font style to italic 
// Prefix text with "✔ " 
// Hint: :not() and :first-child

let policyExceptFirst = document.querySelectorAll("p.policy:not(:first-child)");
policyExceptFirst.forEach(p => {
    p.style.fontStyle = "italic";
    p.textContent = "✔ " + p.textContent;
});