
const enquiryForm = document.getElementById('enquiryForm');
const successMessage = document.getElementById('successMessage');

enquiryForm.addEventListener('submit', function(event) {
    event.preventDefault();

    document.querySelectorAll('.error-message').forEach(error => error.textContent = '');
    
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        mobile: document.getElementById('mobile').value.trim(),
        requestType: document.getElementById('requestType').value,
        policyType: document.getElementById('policyType').value,
        message: document.getElementById('message').value.trim(),
        rating: document.querySelector('input[name="rating"]:checked')
    };

    if (validateForm(formData)) {
        showSuccessMessage();
        enquiryForm.reset();
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }
});

function validateForm(data) {
    if (!data.fullName) {
        showError('fullNameError', 'Full name is required');
        return false;
    }

    if (!data.email) {
        showError('emailError', 'Email is required');
        return false;
    } else if (!isValidEmail(data.email)) {
        showError('emailError', 'Please enter a valid email address');
        return false;
    }

    if (!data.mobile) {
        showError('mobileError', 'Mobile number is required');
        return false;
    } else if (!/^\d{10}$/.test(data.mobile)) {
        showError('mobileError', 'Mobile number must be exactly 10 digits');
        return false;
    }

    if (!data.requestType) {
        showError('requestTypeError', 'Please select a request type');
        return false;
    }

    if (!data.policyType) {
        showError('policyTypeError', 'Please select a policy type');
        return false;
    }

    if (!data.message) {
        showError('messageError', 'Message is required');
        return false;
    } else if (data.message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters long');
        return false;
    }

    if (!data.rating) {
        showError('ratingError', 'Please select an experience rating');
        return false;
    }

    return true;
}

function showError(fieldId, message) {
    document.getElementById(fieldId).textContent = message;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showSuccessMessage() {
    successMessage.textContent = 'Thank you! Your enquiry has been successfully submitted.';
    successMessage.classList.add('show');
}