const API_URL = "https://jsonplaceholder.typicode.com/users";
const STORAGE_KEY = "bank_accounts";

let accounts = [];

// ========================
// TASK 9: LOAD FROM localStorage ON START
// ========================
window.onload = function () {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
        accounts = JSON.parse(savedData);
        populateBranchDropdown(accounts);
        displayAccounts(accounts);
        updateTotalBalance();
    }
};

// ========================
// TASK 1 + TASK 6: FETCH ACCOUNTS WITH LOADER & ERROR HANDLING
// ========================

async function fetchAccounts() {
    const loader = document.getElementById("loader");
    const errorBox = document.getElementById("errorMessage");

    errorBox.style.display = "none";
    errorBox.textContent = "";

    try {
        loader.style.display = "block";

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();

        accounts = data.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            branch: user.address.city,
            balance: getRandomBalance(10000, 50000),
            transactions: []
        }));

        saveToLocalStorage();   // TASK 9
        populateBranchDropdown(accounts);
        displayAccounts(accounts);
        updateTotalBalance();

    } catch (error) {
        console.error("Error fetching accounts:", error);
        errorBox.style.display = "block";
        errorBox.textContent =
            "❌ Failed to load accounts. Please check your internet or try again later.";

    } finally {
        loader.style.display = "none";
    }
}

function getRandomBalance(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ========================
// TASK 9: SAVE STATE TO localStorage
// ========================
function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

// ========================
// DISPLAY ACCOUNTS (with low-balance highlight)
// ========================

function displayAccounts(accountList) {
    const tableBody = document.getElementById("accountsTable");
    tableBody.innerHTML = "";

    accountList.forEach(account => {
        const row = document.createElement("tr");

        if (account.balance < 5000) {
            row.classList.add("low-balance"); // TASK 10
        }

        row.innerHTML = `
            <td>${account.id}</td>
            <td>${account.name}</td>
            <td>${account.email}</td>
            <td>${account.branch}</td>
            <td id="balance-${account.id}">₹${account.balance.toLocaleString()}</td>
            <td>
                <button onclick="deposit(${account.id})">Deposit</button>
                <button onclick="withdraw(${account.id})">Withdraw</button>
                <button onclick="viewHistory(${account.id})">View History</button>
                <button onclick="deleteAccount(${account.id})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    updateTotalBalance();
}

// ========================
// TASK 2: SEARCH & FILTER
// ========================

function populateBranchDropdown(accountList) {
    const branchFilter = document.getElementById("branchFilter");

    branchFilter.innerHTML = `<option value="all">All Branches</option>`;

    const branches = [...new Set(accountList.map(acc => acc.branch))];

    branches.forEach(branch => {
        const option = document.createElement("option");
        option.value = branch;
        option.textContent = branch;
        branchFilter.appendChild(option);
    });
}

function handleSearch() {
    const searchText = document
        .getElementById("searchInput")
        .value.toLowerCase();

    const selectedBranch = document.getElementById("branchFilter").value;

    const filteredAccounts = accounts.filter(acc => {
        const matchesName = acc.name.toLowerCase().includes(searchText);
        const matchesBranch =
            selectedBranch === "all" || acc.branch === selectedBranch;

        return matchesName && matchesBranch;
    });

    displayAccounts(filteredAccounts);
}

function handleFilter() {
    handleSearch();
}

// ========================
// TASK 7: TRANSACTION HELPER
// ========================

function addTransaction(account, type, amount, note = "") {
    account.transactions.push({
        type,
        amount,
        balanceAfter: account.balance,
        note,
        timestamp: new Date().toLocaleString()
    });
}

// ========================
// TASK 3 + TASK 8: DEPOSIT & WITHDRAW WITH MIN BALANCE RULE
// ========================

function deposit(accountId) {
    const amount = Number(prompt("Enter amount to deposit:"));
    const account = accounts.find(acc => acc.id === accountId);

    if (amount > 0 && account) {
        account.balance += amount;
        addTransaction(account, "DEPOSIT", amount);
        updateBalanceUI(accountId);
        saveToLocalStorage(); // TASK 9
    }
}

function withdraw(accountId) {
    const amount = Number(prompt("Enter amount to withdraw:"));
    const account = accounts.find(acc => acc.id === accountId);

    if (amount > 0 && account) {

        if (account.balance >= amount) {
            account.balance -= amount;
            addTransaction(account, "WITHDRAW", amount);

            if (account.balance < 5000) {
                account.balance -= 200;
                addTransaction(account, "PENALTY", 200, "Minimum balance violation");

                alert(
`Warning: Your balance is below ₹5,000.
₹200 penalty has been applied.`
                );
            }

            updateBalanceUI(accountId);
            saveToLocalStorage(); // TASK 9

        } else {
            alert("Insufficient Balance ");
        }
    }
}

function updateBalanceUI(accountId) {
    const account = accounts.find(acc => acc.id === accountId);
    const balanceCell = document.getElementById(`balance-${accountId}`);

    if (balanceCell && account) {
        balanceCell.textContent = "₹" + account.balance.toLocaleString();
    }

    updateTotalBalance();
}

// ========================
// TASK 7: VIEW TRANSACTION HISTORY
// ========================

function viewHistory(accountId) {
    const account = accounts.find(acc => acc.id === accountId);

    if (!account || account.transactions.length === 0) {
        alert("No transactions found for this account.");
        return;
    }

    let historyText = `Transaction History for Account #${accountId}\n\n`;

    account.transactions.forEach((tx, i) => {
        historyText += `${i + 1}. ${tx.type}
Amount: ₹${tx.amount}
Balance After: ₹${tx.balanceAfter}
Time: ${tx.timestamp}
${tx.note ? "Note: " + tx.note : ""}
-------------------------\n`;
    });

    alert(historyText);
}

// ========================
// TASK 4: CREATE NEW ACCOUNT (POST)
// ========================

async function createAccount(event) {
    event.preventDefault();

    const name = document.getElementById("newName").value;
    const email = document.getElementById("newEmail").value;
    const branch = document.getElementById("newBranch").value;

    const newAccount = {
        name,
        email,
        address: { city: branch }
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAccount)
        });

        const createdUser = await response.json();

        const accountToAdd = {
            ...createdUser,
            id: accounts.length ? Math.max(...accounts.map(a => a.id)) + 1 : 1,
            branch: branch,
            balance: 20000,
            transactions: []
        };

        accounts.push(accountToAdd);
        saveToLocalStorage(); // TASK 9
        populateBranchDropdown(accounts);
        displayAccounts(accounts);

        document.getElementById("createAccountForm").reset();

    } catch (error) {
        console.error("Error creating account:", error);
    }
}

// ========================
// TASK 5: DELETE ACCOUNT (DELETE)
// ========================

async function deleteAccount(accountId) {

    const confirmDelete = confirm(
        `Are you sure you want to delete Account #${accountId}?`
    );

    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_URL}/${accountId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            accounts = accounts.filter(acc => acc.id !== accountId);
            saveToLocalStorage(); // TASK 9
            populateBranchDropdown(accounts);
            displayAccounts(accounts);
            alert("Account deleted successfully ✅");
        } else {
            alert("Failed to delete account ❌");
        }

    } catch (error) {
        console.error("Error deleting account:", error);
    }
}

// ========================
// TASK 10: SORT & TOTAL BALANCE
// ========================

function sortByBalance() {
    accounts.sort((a, b) => b.balance - a.balance); // High → Low
    saveToLocalStorage();
    displayAccounts(accounts);
}

function updateTotalBalance() {
    const total = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    document.getElementById("totalBalance").textContent =
        total.toLocaleString();
}
