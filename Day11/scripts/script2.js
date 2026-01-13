// Exercise 1 – Basic (Event Bubbling)  
// You are building an insurance payment page. A button "Pay Premium" is inside a div "paymentSection". 
// Tasks:  
// 1. Add click event to both div and button.  
// 2. Observe and write the output order when bu on is clicked.  
// 3. Men on which event phase is occurring.  

mybutton=document.getElementById('payp');
mydiv=document.getElementById('paymentSection');

function clickHandlerchild(){
    console.log('child event handled');
}
function clickHandlerparent(){
    console.log('parent event handled');
}
mybutton.addEventListener('click',clickHandlerchild);
mydiv.addEventListener('click',clickHandlerparent);
   
// Exercise 2 – Basic (Event Capturing)  
// On a policy page, a container validates user before showing policy details.  
// Tasks:  
// 1. Use capturing phase for both parent and child.  
// 2. Ensure parent runs first.  
// 3. Write expected console output.  
function clickHandlerchild2(){
    console.log('child display');
}
function clickHandlerparent2(){
    console.log('parent display');
}
mybutton.addEventListener('click',clickHandlerchild2,true);
mydiv.addEventListener('click',clickHandlerparent2 ,true);

// Exercise 3 – Intermediate (stopPropagation) 
// Insurance dashboard shows policy cards. Clicking card navigates to details, but clicking delete should only delete.  
// Tasks:  
// 1. Stop event bubbling on delete button.  
// 2. Prevent navigation log from appearing.  
// 3. Write JavaScript code 

function openPolicyDetails(type){
    console.log(`navigation to ${type} policy details `);

}
function deletePolicy(event){
    console.log("delete occured");
    event.stopPropagation();
}


// Exercise 4 – Intermediate (Reinforce bubbling, capturing, and stopPropagation together) 
// You are building an Insurance Claims Dashboard. 
// Each Claim Row is clickable → Opens Claim Details page 
// Inside each row there is an Approve Claim bu on → Approves the claim without navigation

spanele=document.querySelectorAll('.claim-row');
spanele.forEach((eve)=>{
eve.addEventListener('click',(e)=>{
    console.log(eve.querySelector('span').innerHTML);
    
})
})

butto=document.querySelectorAll('.approve-btn');
butto.forEach((eve)=>{
eve.addEventListener('click',(e)=>{
    console.log('Approved');
e.stopPropagation(); 
})
})

