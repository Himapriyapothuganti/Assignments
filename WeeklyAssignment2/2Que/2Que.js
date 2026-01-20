
const plans = [
  { name: 'Health Insurance', base: 3000 },
  { name: 'Life Insurance', base: 5000 },
  { name: 'Vehicle Insurance', base: 2000 }
];

let customers = [];
const plansContainer = document.getElementById('plansContainer');
const policyTypeSelect = document.getElementById('policyType');
const customersTbody = document.getElementById('customersTbody');
const filterPolicy = document.getElementById('filterPolicy');
const searchName = document.getElementById('searchName');
const coverageSlider = document.getElementById('coverage');
const coverageValue = document.getElementById('coverageValue');

const statCustomers = document.getElementById('statCustomers');
const statPremium = document.getElementById('statPremium');

function init(){
  renderPlans();
  populatePolicyOptions();
  bindEvents();
  updateSummary();
}

function renderPlans(){
  plansContainer.innerHTML = plans.map(p=>`
    <div class="bg-white p-4 rounded shadow">
      <h5 class="font-semibold">${p.name}</h5>
      <div class="text-sm text-slate-600">Base: ₹${p.base}</div>
      <div class="mt-3"><button data-plan="${p.name}" class="enroll-btn px-3 py-1 bg-blue-500 text-white rounded">Enroll</button></div>
    </div>
  `).join('');
  document.querySelectorAll('.enroll-btn').forEach(b=>b.addEventListener('click', e=>{
    const plan = e.target.dataset.plan;
    policyTypeSelect.value = plan;
    document.getElementById('name').focus();
  }));
}

function populatePolicyOptions(){
  plans.forEach(p=>{
    const opt = document.createElement('option'); opt.value = p.name; opt.textContent = p.name;
    policyTypeSelect.appendChild(opt);
    const opt2 = document.createElement('option'); opt2.value = p.name; opt2.textContent = p.name;
    filterPolicy.appendChild(opt2);
  });
}

function bindEvents(){
  document.getElementById('enquiryForm').addEventListener('submit', onSubmit);
  filterPolicy.addEventListener('change', renderTable);
  searchName.addEventListener('input', renderTable);
  coverageSlider.addEventListener('input', ()=> coverageValue.textContent = coverageSlider.value);
  document.getElementById('ctaEnroll').addEventListener('click', ()=> document.getElementById('name').focus());
}

function onSubmit(e){
  e.preventDefault();
  clearErrors();
  const name = document.getElementById('name').value.trim();
  const age = Number(document.getElementById('age').value);
  const email = document.getElementById('email').value.trim();
  const policyType = policyTypeSelect.value;
  const coverage = Number(coverageSlider.value); // in Lakh

  let ok = true;
  if(!name){ showError('nameError','Name required'); ok=false }
  if(!age || age<=0){ showError('ageError','Valid age required'); ok=false }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ showError('emailError','Valid email required'); ok=false }
  if(!policyType){ showError('policyError','Select policy'); ok=false }
  if(!ok) return;

  const premium = calculatePremium(age, policyType, coverage);
  const customer = { id: Date.now(), name, age, policyType, coverage, premium };
  customers.push(customer);
  renderTable();
  updateSummary();
  e.target.reset(); coverageValue.textContent = '1';
}

function clearErrors(){ document.querySelectorAll('.error').forEach(el=>el.textContent='') }
function showError(id,msg){ document.getElementById(id).textContent = msg }

function calculatePremium(age, policyType, coverage){
  const plan = plans.find(p=>p.name===policyType);
  if(!plan) return 0;
  let premium = plan.base;
  if(age>45) premium += Math.round(plan.base * 0.2);
  
  premium += coverage * 500;
  return premium;
}

function renderTable(){
  const filter = filterPolicy.value;
  const search = searchName.value.trim().toLowerCase();
  const rows = customers
    .filter(c=> !filter || c.policyType===filter)
    .filter(c=> !search || c.name.toLowerCase().includes(search))
    .map(c=>`<tr>
      <td>${c.name}</td>
      <td>${c.age}</td>
      <td>${c.policyType}</td>
      <td>${c.coverage}</td>
      <td>₹${c.premium}</td>
    </tr>`).join('');
  customersTbody.innerHTML = rows || '<tr><td colspan="5" class="text-slate-500">No customers</td></tr>';
  statCustomers.textContent = customers.length;
}

function updateSummary(){
  const total = customers.reduce((s,c)=>s+c.premium,0);
  statPremium.textContent = `₹${total}`;
}

init();
