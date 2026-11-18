
// ========================================
// VOLUNTEER MODAL
// Registration + Upcoming Events
// ========================================

// Main modal
const volunteerModal =
    document.getElementById('volunteer-modal');

// Modal navigation
const volunteerTabs =
    document.querySelectorAll('.volunteer-nav-tab');

const volunteerPanels = {
    register: document.getElementById('register-panel'),
    events: document.getElementById('events-panel')
};

// Close button
const closeModalBtn =
    volunteerModal.querySelector('.modal-close');

// Main website buttons
const registerBtns =
    document.querySelectorAll('.register-btn');

const eventsBtns =
    document.querySelectorAll('.events-btn');

const eventsBrowseBtns =
    document.querySelectorAll('.events-browse-btn');


// ========================================
// PREVENT BACKGROUND PAGE SCROLLING
// ========================================

function updatePageScrollLock() {
    const hasOpenModal =
        document.querySelector('dialog[open]');

    document.body.classList.toggle(
        'modal-open',
        !!hasOpenModal
    );
}


// ========================================
// SWITCH BETWEEN MODAL PANELS
// ========================================

function switchVolunteerPanel(panelName) {

    const selectedPanel = volunteerPanels[panelName];

    if (!selectedPanel) return;

    // Show the selected panel
    Object.entries(volunteerPanels).forEach(([name, panel]) => {
        panel.hidden = name !== panelName;
    });

    // Update sidebar tab states
    volunteerTabs.forEach((tab) => {

        const isActive =
            tab.dataset.panel === selectedPanel.id;

        tab.classList.toggle('active', isActive);

        tab.setAttribute(
            'aria-selected',
            String(isActive)
        );

    });

    // Change the outer modal frame color
    volunteerModal.classList.toggle(
        'events-active',
        panelName === 'events'
    );

}


// ========================================
// OPEN AND CLOSE THE MODAL
// ========================================

function openVolunteerModal(panelName = 'register') {

    switchVolunteerPanel(panelName);

    if (!volunteerModal.open) {
        volunteerModal.showModal();
    }

    updatePageScrollLock();

}


// Register buttons open the Register panel
registerBtns.forEach((button) => {

    button.addEventListener('click', () => {
        resetRegistrationFlow();
        openVolunteerModal('register');
    });

});


// Events buttons open the Upcoming Events panel
eventsBtns.forEach((button) => {

    button.addEventListener('click', () => {
        openVolunteerModal('events');
    });

});


// Browse Upcoming Events buttons open the Events panel
eventsBrowseBtns.forEach((button) => {

    button.addEventListener('click', () => {
        openVolunteerModal('events');
    });

});


// Sidebar navigation
volunteerTabs.forEach((tab) => {

    tab.addEventListener('click', () => {

        const panelId = tab.dataset.panel;

        if (panelId === 'register-panel') {
            switchVolunteerPanel('register');
        }

        if (panelId === 'events-panel') {
            switchVolunteerPanel('events');
        }

    });

});


// Close button
closeModalBtn.addEventListener('click', () => {
    volunteerModal.close();
});


// Also update scroll lock when closed with Escape
volunteerModal.addEventListener('close', updatePageScrollLock);


// ========================================
// REGISTRATION TYPE SELECTION
// ========================================

const registrationSelection =
    document.getElementById('registration-selection');

const registrationFormScreen =
    document.getElementById('registration-form-screen');

const registrationTypes =
    document.querySelectorAll(
        'input[name="registration-type"]'
    );

const registrationForms = {
    individual: document.getElementById('individual-fields'),
    'small-group': document.getElementById('small-group-fields'),
    'large-group': document.getElementById('large-group-fields')
};

const registrationFormWrappers =
    document.querySelectorAll('.registration-form-wrapper');

// ========================================
// BACK BUTTONS
// ========================================

const registrationBackButtons =
    document.querySelectorAll('.registration-back');

registrationBackButtons.forEach((button) => {

    button.addEventListener('click', () => {

        // Hide registration form screen
        registrationFormScreen.hidden = true;

        // Return to registration type selection
        registrationSelection.hidden = false;

    });

});


// ========================================
// SHOW SELECTED REGISTRATION FORM
// ========================================

registrationTypes.forEach((radio) => {

    radio.addEventListener('click', () => {

        // Hide and disable all forms
        Object.values(registrationForms).forEach((form) => {
            form.hidden = true;
            form.disabled = true;
        });

        // Hide all form wrappers and banners
        registrationFormWrappers.forEach((wrapper) => {
            wrapper.hidden = true;
        });

        // Show and enable selected form
        const selectedForm = registrationForms[radio.value];

        if (selectedForm) {
            selectedForm.hidden = false;
            selectedForm.disabled = false;
        }

        // Show the matching banner wrapper
        const selectedWrapper = document.querySelector(
            `.registration-form-wrapper[data-form="${radio.value}"]`
        );

        if (selectedWrapper) {
            selectedWrapper.hidden = false;
        }

        // Switch to registration form screen
        registrationSelection.hidden = true;
        registrationFormScreen.hidden = false;

    });

});

// ========================================
// INDIVIDUAL FORM INTERACTIONS
// ========================================

// EMAIL CONFIRMATION

const individualEmail = document.getElementById('individual-email');
const confirmEmail = document.getElementById('individual-confirm-email');

function checkEmailMatch() {

    if (!individualEmail || !confirmEmail) return;

    // Reset the previous error
    confirmEmail.setCustomValidity('');

    // Only compare when both fields have values
    if (
        individualEmail.value !== '' &&
        confirmEmail.value !== '' &&
        individualEmail.value.trim().toLowerCase() !==
        confirmEmail.value.trim().toLowerCase()
    ) {
        confirmEmail.setCustomValidity('Email addresses do not match.');
    }

}

// Check whenever either email changes
individualEmail?.addEventListener('input', checkEmailMatch);
confirmEmail?.addEventListener('input', checkEmailMatch);

individualEmail?.addEventListener('change', checkEmailMatch);
confirmEmail?.addEventListener('change', checkEmailMatch);


// ========================================
// SMALL GROUP: PRIMARY CONTACT
// ========================================

const smallContactFirst =
    document.getElementById('small-contact-first');

const smallContactLast =
    document.getElementById('small-contact-last');

const volunteerOneFirst =
    document.querySelector('[data-primary-contact-first]');

const volunteerOneLast =
    document.querySelector('[data-primary-contact-last]');

function updatePrimaryVolunteer() {
    volunteerOneFirst.value = smallContactFirst.value;
    volunteerOneLast.value = smallContactLast.value;
}

// Copy names when the contact information changes
smallContactFirst.addEventListener('input', updatePrimaryVolunteer);
smallContactLast.addEventListener('input', updatePrimaryVolunteer);

// Populate Volunteer 1 when the form is initialized
updatePrimaryVolunteer();

// ========================================
// SMALL GROUP: ADD / REMOVE VOLUNTEERS
// ========================================

const addVolunteerBtn =
    document.getElementById('add-volunteer-btn');

const additionalVolunteers =
    document.getElementById('additional-volunteers');

const volunteerTemplate =
    document.getElementById('small-group-volunteer-template');

const MAX_GROUP_SIZE = 24;


// Update volunteer numbering and form field names
function updateVolunteerNumbers() {

    const volunteerCards =
        additionalVolunteers.querySelectorAll('.additional-volunteer');

    // Volunteer 2 is required and cannot be removed
    volunteerCards.forEach((card, index) => {
        const removeButton = card.querySelector('.remove-volunteer-btn');

        if (removeButton) {
            removeButton.hidden = index === 0;
        }
    });    

    volunteerCards.forEach((card, index) => {

        const volunteerNumber = index + 2;

        card.querySelector('.volunteer-number').textContent =
            `Volunteer ${volunteerNumber} `;

        const firstName = card.querySelector('[data-volunteer-first]');
        const lastName = card.querySelector('[data-volunteer-last]');
        const ageRange = card.querySelector('[data-volunteer-age]');

        firstName.name = `volunteers[${volunteerNumber - 1}][first_name]`;
        lastName.name = `volunteers[${volunteerNumber - 1}][last_name]`;
        ageRange.name = `volunteers[${volunteerNumber - 1}][age_range]`;

        // Give each input a unique ID and matching label
        firstName.id = `small-volunteer-${volunteerNumber}-first`;
        lastName.id = `small-volunteer-${volunteerNumber}-last`;
        ageRange.id = `small-volunteer-${volunteerNumber}-age`;

        const labels = card.querySelectorAll('label');

        labels[0].htmlFor = firstName.id;
        labels[1].htmlFor = lastName.id;
        labels[2].htmlFor = ageRange.id;

    });

    // Disable Add button at the maximum group size
    addVolunteerBtn.disabled =
        volunteerCards.length >= MAX_GROUP_SIZE - 1;

}


// Add a volunteer
addVolunteerBtn.addEventListener('click', () => {

    const currentCount =
        additionalVolunteers.querySelectorAll('.additional-volunteer').length;

    if (currentCount >= MAX_GROUP_SIZE - 1) {
        return;
    }

    const newVolunteer =
        volunteerTemplate.content.cloneNode(true);

    additionalVolunteers.appendChild(newVolunteer);

    updateVolunteerNumbers();

});

// Automatically create Volunteer 2
function initializeSmallGroupVolunteers() {

    if (!additionalVolunteers || !volunteerTemplate) return;

    // Don't create duplicates if the form is initialized again
    if (additionalVolunteers.querySelector('.additional-volunteer')) return;

    const volunteerTwo =
        volunteerTemplate.content.cloneNode(true);

    additionalVolunteers.appendChild(volunteerTwo);

    updateVolunteerNumbers();
}

initializeSmallGroupVolunteers();
// Remove a volunteer
additionalVolunteers.addEventListener('click', (event) => {

    const removeButton =
        event.target.closest('.remove-volunteer-btn');

    if (!removeButton) return;

    const volunteerCard =
        removeButton.closest('.additional-volunteer');

    // Never allow Volunteer 2 to be removed
    if (volunteerCard === additionalVolunteers.firstElementChild) {
        return;
    }

    volunteerCard.remove();

    updateVolunteerNumbers();
    updateMinorAgreements();

});

// ========================================
// SMALL GROUP: AUTOMATIC MINOR AGREEMENTS
// ========================================

const smallGroupFields = document.getElementById("small-group-fields");
const minorAgreements = document.getElementById("small-minor-agreements");

function updateMinorAgreements() {
    const ageFields = smallGroupFields.querySelectorAll(
        "[data-volunteer-age]"
    );

    const hasMinor = Array.from(ageFields).some(
        field => field.value === "under_18"
    );

    // Show or hide the minor agreements
    minorAgreements.hidden = !hasMinor;
    minorAgreements.disabled = !hasMinor;

    // Clear minor agreements when no minors remain
    if (!hasMinor) {
        minorAgreements.querySelectorAll(
            'input[type="checkbox"]'
        ).forEach(checkbox => {
            checkbox.checked = false;
            clearFieldError(checkbox);
        });
    }
}

// Listen for age changes, including dynamically added volunteers
smallGroupFields.addEventListener("change", event => {
    if (event.target.matches("[data-volunteer-age]")) {
        updateMinorAgreements();
    }
});

// Set the correct initial state
updateMinorAgreements();


// ========================================
// LARGE GROUP: PREFERRED DATES
// ========================================

const preferredDates = [
    document.getElementById('large-date-1'),
    document.getElementById('large-date-2'),
];

// Set today's date as the minimum
const today = new Date();
const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split('T')[0];

preferredDates.forEach((dateInput) => {
    dateInput.min = localToday;
});


// Prevent duplicate dates
function checkPreferredDates() {

    preferredDates.forEach((input) => {
        input.setCustomValidity('');
    });

    const selectedDates = preferredDates
        .filter((input) => input.value !== '');

    selectedDates.forEach((input) => {

        const duplicateCount = selectedDates.filter(
            (date) => date.value === input.value
        ).length;

        if (duplicateCount > 1) {
            input.setCustomValidity(
                'Please choose a different date. This date has already been selected.'
            );
        }

    });

}

preferredDates.forEach((input) => {
    input.addEventListener('change', checkPreferredDates);
});

// ========================================
// PHONE NUMBER FORMATTING
// ========================================

const phoneFields = document.querySelectorAll(
    '.registration-form input[type="tel"]'
);

phoneFields.forEach((phone) => {

    phone.addEventListener('input', () => {

        // Keep only numeric digits
        let digits = phone.value.replace(/\D/g, '');

        // Allow a leading US country code (+1)
        if (digits.length === 11 && digits.startsWith('1')) {
            digits = digits.slice(1);
        }

        // Limit to 10 digits
        digits = digits.slice(0, 10);

        // Format as the user types
        let formatted = '';

        if (digits.length > 6) {
            formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        } else if (digits.length > 3) {
            formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        } else if (digits.length > 0) {
            formatted = `(${digits}`;
        }

        phone.value = formatted;

    });

});

// ========================================
// REGISTRATION FORM VALIDATION
// ========================================

// Find the container used to highlight grouped questions and agreements
function getValidationContainer(field) {

    return field.closest(
        '.validation-group, .agreement-item'
    );

}

function getValidationMessage(field) {
    if (field.validity.valueMissing) {
        return "Please complete this required field.";
    }

    if (field.validity.typeMismatch && field.type === "email") {
        return "Please enter a valid email address.";
    }

    if (field.validity.customError) {
        return field.validationMessage;
    }

    if (field.validity.rangeUnderflow) {
        return "Please enter a valid value.";
    }

    if (field.validity.rangeOverflow) {
        return "The value is above the allowed limit.";
    }

    if (field.validity.badInput) {
        return "Please enter a valid value.";
    }

    if (field.validity.patternMismatch && field.type === "tel") {
    return "Please enter a valid 10-digit phone number.";
    }

    return "Please check this field.";
}


// Show validation feedback
function showFieldError(field) {

    const container = getValidationContainer(field);

    // Highlight question or agreement area
    if (container) {
        container.classList.add('is-invalid');

        // Agreements don't need an error message
        if (
            field.type === 'checkbox' &&
            container.classList.contains('agreement-item')
        ) {
            return;
        }

        // Radio questions don't need individual field messages
        return;
    }

    // Regular text, email, select, and other fields
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');

    let message = field.parentElement.querySelector(
        `.validation-message[data-for="${field.id}"]`
    );

    if (!message) {
        message = document.createElement('span');
        message.className = 'validation-message';
        message.dataset.for = field.id;
        field.insertAdjacentElement('afterend', message);
    }

    message.textContent = getValidationMessage(field);
}


// Remove validation feedback
function clearFieldError(field) {

    const container = getValidationContainer(field);

    if (container) {
        container.classList.remove('is-invalid');
        return;
    }

    field.classList.remove('is-invalid');
    field.setAttribute('aria-invalid', 'false');

    const message = field.parentElement.querySelector(
        `.validation-message[data-for="${field.id}"]`
    );

    if (message) {
        message.remove();
    }

    if (
        field.value.trim() !== '' &&
        field.checkValidity()
    ) {
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
    }
}


// Validate an individual field
function validateField(field) {

    if (field.matches(':disabled')) return true;

    let isValid = true;

    if (!field.checkValidity()) {
        showFieldError(field);
        isValid = false;
    } else {
        clearFieldError(field);
    }

    // Update the required-fields note
    const form = field.closest('.registration-form');
    const requiredNote = form?.querySelector('.required-note');

    if (requiredNote) {
        const hasErrors = form.querySelector(
            '.is-invalid'
        );

        requiredNote.classList.toggle(
            'has-errors',
            !!hasErrors
        );
    }

    return isValid;
}


// ========================================
// VALIDATION EVENT LISTENERS
// ========================================


// Check fields after someone leaves them
volunteerModal.addEventListener('focusout', (event) => {

    const field = event.target;

    if (
        field.matches('input, select, textarea') &&
        field.closest('fieldset') &&
        !field.disabled &&
        field.type !== 'radio'
    ) {
        validateField(field);
    }

});


// Update text fields as someone corrects them
volunteerModal.addEventListener('input', (event) => {

    const field = event.target;

    if (
        field.matches('input, select, textarea') &&
        field.classList.contains('is-invalid')
    ) {
        validateField(field);
    }

});


// Update radio groups and checkboxes when selected
volunteerModal.addEventListener('change', (event) => {

    const field = event.target;

    if (!field.matches('input, select, textarea')) return;

    if (field.type === 'radio') {

        // Validate the entire radio question
        const group = field.closest('.validation-group');

        if (group) {
            const radios = group.querySelectorAll(
                'input[type="radio"][required]'
            );

            const isAnswered = Array.from(radios).some(
                radio => radio.checked
            );

            if (isAnswered) {
                group.classList.remove('is-invalid');
            }
        }

        return;
    }

    validateField(field);

});


// ========================================
// REGISTRATION FORM SUBMISSION
// ========================================

const registrationStatus =
    document.getElementById('registration-status');

const registrationLoading =
    document.getElementById('registration-loading');

const registrationSuccess =
    document.getElementById('registration-success');

const modalHeader =
    volunteerModal.querySelector('.modal-header');

const volunteerLayout =
    volunteerModal.querySelector('.volunteer-layout');

const modalCloseButton =
    volunteerModal.querySelector('.modal-close');

const loadingProgressBar =
    volunteerModal.querySelector('.loading-progress-bar');

const registrationSubmitForms =
    document.querySelectorAll('.registration-form');

let registrationTimer;


// Handle submission for all three registration forms
registrationSubmitForms.forEach((form) => {

    form.addEventListener('submit', (event) => {

        // Stop the browser from reloading the page
        event.preventDefault();

        // Run any custom validation checks first
        checkEmailMatch();
        checkPreferredDates();

        // Collect the fields that actually need validation
        const fields = Array.from(
            form.querySelectorAll('input, select, textarea')
        ).filter((field) => {
            return !field.matches(':disabled');
        });

        // Validate every active field
        let isValid = true;
        let firstInvalidField = null;

        fields.forEach((field) => {

            if (!validateField(field)) {
                isValid = false;

                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }

        });

        // Highlight the required-fields note when errors exist
        const requiredNote = form.querySelector('.required-note');

        if (requiredNote) {
            requiredNote.classList.toggle('has-errors', !isValid);
        }

        // Stop if something needs correcting
        if (!isValid) {
            firstInvalidField?.focus();
            return;
        }

        // Show the submission screen
        showRegistrationLoading(form);;

    });

});

// ========================================
// PERSONALIZED SUCCESS MESSAGE
// ========================================

function updateSuccessMessage(form) {

    const formType = form.dataset.registrationForm;

    const successMessage =
        document.getElementById('success-message');

    const successSubmessage =
        document.getElementById('success-submessage');

    let firstName = '';
    let eventName = '';

    // INDIVIDUAL REGISTRATION
    if (formType === 'individual') {

        firstName =
            form.querySelector('#individual-first').value.trim();

        eventName =
            form.querySelector('#individual-event-select').selectedOptions[0].textContent.trim();

        successMessage.textContent =
            `Thank you, ${firstName}, for registering!`;

        successSubmessage.innerHTML =
        `You're registered for ${eventName}.<br>
        Your interest in caring for NYC's trees makes a difference. 🌳`;

    }

    // SMALL GROUP REGISTRATION
    else if (formType === 'small-group') {

        firstName =
            form.querySelector('#small-contact-first').value.trim();

        eventName =
            form.querySelector('#small-group-event-select').selectedOptions[0].textContent.trim();

        successMessage.textContent =
            `Thank you, ${firstName}, for registering!`;

        successSubmessage.innerHTML =
        `Your group is registered for ${eventName}.<br>
        Your interest in caring for NYC's trees makes a difference. 🌳`;

    }

    // LARGE ORGANIZATION REQUEST
    else if (formType === 'large-group') {

        firstName =
            form.querySelector('#large-contact-first').value.trim();

        const organization =
            form.querySelector('#large-organization-name').value.trim();

        successMessage.textContent =
            `Thank you, ${firstName}!`;

        successSubmessage.innerHTML =
        `Your volunteer request for ${organization} is submitted.<br>
        Your interest in caring for NYC's trees makes a difference. 🌳`;
    
    }

}

// ========================================
// SHOW LOADING ANIMATION
// ========================================

function showRegistrationLoading(form) {

    // Hide the regular modal content
    modalHeader.hidden = true;
    volunteerLayout.hidden = true;
    modalCloseButton.hidden = true;

    // Show the submission screen
    registrationStatus.hidden = false;
    registrationLoading.hidden = false;
    registrationSuccess.hidden = true;

    // Reset progress bar
    loadingProgressBar.style.width = '0%';

    // Allow the browser to display the initial state
    requestAnimationFrame(() => {
        loadingProgressBar.style.width = '100%';
    });

    // Simulate a short registration process
    registrationTimer = setTimeout(() => {

    // Personalize the confirmation using the submitted form
    updateSuccessMessage(form);

    registrationLoading.hidden = true;
    registrationSuccess.hidden = false;

}, 4000);

}


// ========================================
// CLOSE AFTER SUCCESSFUL REGISTRATION
// ========================================

registrationSuccess.addEventListener('click', () => {
    volunteerModal.close();
});


// ========================================
// RESET SUBMISSION SCREEN WHEN MODAL CLOSES
// ========================================

volunteerModal.addEventListener('close', () => {

    clearTimeout(registrationTimer);

    // Restore the regular modal content
    modalHeader.hidden = false;
    volunteerLayout.hidden = false;
    modalCloseButton.hidden = false;

    // Hide the submission screen
    registrationStatus.hidden = true;
    registrationLoading.hidden = true;
    registrationSuccess.hidden = true;

    // Reset the progress bar
    loadingProgressBar.style.width = '0%';

});


// ========================================
// TREES COUNT! EVENT DATA
// ========================================


const events = [

    // ========================================
    // SPRING — COMPLETED EVENTS
    // ========================================

    {
        id: "queens-farm",
        name: "Trees Count! at Queens Farm",
        park: "Queens Farm Park",
        borough: "queens",
        boroughName: "Queens",
        season: "spring",

        date: "2026-04-18",
        startTime: "10:00 AM",
        endTime: "1:00 PM",

        address: "",
        meetingPoint: "",

        description:
            "Join us for a spring volunteer day at Queens Farm! Help document neighborhood trees and learn how urban forests support local communities.",

        registration: {
            opens: null,
            closes: null,
            status: "closed"
        },

        image: "./img/modal/events/parks/queens-farm-park.jpg",
        status: "completed",
        featured: false,

        tags: []
    },

    {
        id: "inwood-hill",
        name: "Trees Count! at Inwood Hill Park",
        park: "Inwood Hill Park",
        borough: "manhattan",
        boroughName: "Manhattan",
        season: "spring",

        date: "2026-05-02",
        startTime: "10:00 AM",
        endTime: "1:00 PM",

        address: "",
        meetingPoint: "",

        description:
            "Explore one of Manhattan's natural landscapes while helping us collect valuable information about NYC's trees.",

        registration: {
            opens: null,
            closes: null,
            status: "closed"
        },

        image: "./img/modal/events/parks/inwood-hill-park.jpg",
        status: "completed",
        featured: false,

        tags: []
    },

    {
        id: "clove-lakes",
        name: "Trees Count! at Clove Lakes Park",
        park: "Clove Lakes Park",
        borough: "staten-island",
        boroughName: "Staten Island",
        season: "spring",

        date: "2026-05-16",
        startTime: "10:00 AM",
        endTime: "1:00 PM",

        address: "",
        meetingPoint: "",

        description:
            "Spend the day outdoors helping document Staten Island's urban forest and support healthier neighborhood green spaces.",

        registration: {
            opens: null,
            closes: null,
            status: "closed"
        },

        image: "./img/modal/events/parks/clove-lakes-park.jpg",
        status: "completed",
        featured: false,

        tags: []
    },


    // ========================================
    // SUMMER — CURRENT EVENTS
    // ========================================

    {
        id: "urban-park-rangers",
        name: "Trees Count! with Urban Park Rangers",
        park: "Highbridge Park",
        borough: "manhattan",
        boroughName: "Manhattan",
        season: "summer",

        date: "2026-08-08",
        startTime: "10:00 AM",
        endTime: "12:00 PM",

        address: "Manhattan Side (Washington Heights): W 172nd Street & Amsterdam Avenue, New York, NY. / Bronx Side (Highbridge): West 170th Street & University Avenue, Bronx, NY.",
        meetingPoint: "Park entrance on the east side of Amsterdam Avenue at W 172nd Street, just outside the stone Highbridge water tower.",

        description:
            "Discover the natural world with NYC Urban Park Rangers! Join us for an outdoor exploration of trees, wildlife, and the important role urban forests play in our city.",

        registration: {
            opens: null,
            closes: null,
            status: "open"
        },

        image: "./img/modal/events/parks/highbridge-park.jpg",
        status: "open",
        featured: true,

        tags: [
            { label: "Special Guest", type: "guest" },
        ]
    },

    {
        id: "fountain-of-youth",
        name: "Trees Count! at Fountain of Youth Playground",
        park: "Fountain of Youth Playground",
        borough: "bronx",
        boroughName: "the Bronx",
        season: "summer",

        date: "2026-08-12",
        startTime: "10:00 AM",
        endTime: "1:00 PM",

        address: "Union Avenue, East 150th Street, Tinton Avenue, and East 152nd Street, Longwood/Mott Haven, Bronx, NY.",
        meetingPoint: "Union Avenue entrance (main side), between East 150th Street and East 152nd Street.",

        description:
            "Help us learn more about the trees growing around our neighborhood playgrounds. Every tree counted contributes to a greener, healthier city.",

        registration: {
            opens: null,
            closes: null,
            status: "open"
        },

        image: "./img/modal/events/parks/fountain-of-youth-playground.jpg",
        status: "open",
        featured: false,

        tags: []
    },

    {
        id: "snug-harbor",
        name: "Trees Count! at Snug Harbor",
        park: "Snug Harbor Park",
        borough: "staten-island",
        boroughName: "Staten Island",
        season: "summer",

        date: "2026-08-15",
        startTime: "10:00 AM",
        endTime: "1:00 PM",

        address: "1000 Richmond Terrace, Staten Island, NY.",
        meetingPoint: "North Gate at Richmond Terrace.",

        description:
            "Explore the beautiful grounds of Snug Harbor while helping document the trees that make our public spaces special.",

        registration: {
            opens: null,
            closes: null,
            status: "open"
        },

        image: "./img/modal/events/parks/snug-harbor-park.jpg",
        status: "open",
        featured: false,

        tags: []
    },

    {
        id: "gilbert-ramirez",
        name: "Trees Count! at Gilbert Ramirez Park",
        park: "Gilbert Ramirez Park",
        borough: "brooklyn",
        boroughName: "Brooklyn",
        season: "summer",

        date: "2026-08-19",
        startTime: "10:00 AM",
        endTime: "1:00 PM",

        address: "McKibbin Street between White Street and Bogart Street, Brooklyn, NY.",
        meetingPoint: "Playground entrance.",

        description:
            "Come out and help us document the trees in your neighborhood. Learn about the benefits of urban greenery while making a difference in your community.",

        registration: {
            opens: null,
            closes: null,
            status: "open"
        },

        image: "./img/modal/events/parks/gilbert-ramirez-park.jpg",
        status: "open",
        featured: false,

        tags: []
    },

    {
        id: "st-marys",
        name: "Trees Count! at St. Mary's Park",
        park: "St. Mary's Park",
        borough: "bronx",
        boroughName: "the Bronx",
        season: "summer",

        date: "2026-08-22",
        startTime: "10:00 AM",
        endTime: "1:00 PM",

        address: "St. Mary's Street between St. Ann's Avenue and Jackson Avenue, Bronx, NY.",
        meetingPoint: "East 149th Street entrance (North Side).",

        description:
            "Join fellow volunteers at St. Mary's Park to help us understand and care for the trees that make our neighborhoods greener.",

        registration: {
            opens: null,
            closes: null,
            status: "open"
        },

        image: "./img/modal/events/parks/st-marys-park.jpg",
        status: "open",
        featured: false,

        tags: []
    },


    // ========================================
    // FALL — UPCOMING EVENTS
    // ========================================

    {
        id: "climate-week",
        name: "Trees Count! - Climate Week",
        park: "Prospect Park",
        borough: "brooklyn",
        boroughName: "Brooklyn",
        season: "fall",

        date: "2026-09-24",
        startTime: "10:00 AM",
        endTime: "1:00 PM",

        address: "",
        meetingPoint: "",

        description:
            "Celebrate Climate Week and discover how trees help create a healthier, more climate-resilient city.",

        registration: {
            opens: null,
            closes: null,
            status: "opening-soon"
        },

        image: "./img/modal/events/parks/prospect-park.jpg",
        status: "coming-soon",
        featured: true,

        tags: [
            { label: "Special Event", type: "event" },
        ]
    },

    {
        id: "city-forest-day",
        name: "Trees Count! - City of Forest Day",
        park: "Crotona Park",
        borough: "bronx",
        boroughName: "the Bronx",
        season: "fall",

        date: "2026-10-03",
        startTime: "10:00 AM",
        endTime: "2:00 PM",

        address: "",
        meetingPoint: "",

        description:
            "Celebrate NYC's urban forest! Join your community for a day dedicated to trees, environmental stewardship, and greener neighborhoods.",

        registration: {
            opens: null,
            closes: null,
            status: "opening-soon"
        },

        image: "./img/modal/events/parks/crotona-park.jpg",
        status: "coming-soon",
        featured: true,

        tags: [
            { label: "Special Event", type: "event" },
        ]
    },

    {
        id: "fungal-edition",
        name: "Trees Count! - Fungal Edition with NYC Mushroom Network",
        park: "Carl Schurz Park",
        borough: "manhattan",
        boroughName: "Manhattan",
        season: "fall",

        date: "2026-10-17",
        startTime: "10:00 AM",
        endTime: "1:00 PM",

        address: "",
        meetingPoint: "",

        description:
            "Take a closer look at the fascinating world beneath our feet! Discover the connections between fungi, soil, and the health of our urban forests.",

        registration: {
            opens: null,
            closes: null,
            status: "opening-soon"
        },

        image: "./img/modal/events/parks/carl-schurz-park.jpg",
        status: "coming-soon",
        featured: true,

        tags: [
            { label: "Special Event", type: "event" },
            { label: "Special Guest", type: "guest" },
        ]
    },

    {
        id: "playground-one-forty",
        name: "Trees Count! at Playground One Forty",
        park: "Playground One Forty",
        borough: "queens",
        boroughName: "Queens",
        season: "fall",

        date: "2026-10-14",
        startTime: "10:00 AM",
        endTime: "1:00 PM",

        address: "",
        meetingPoint: "",

        description:
            "Help us document the trees around your community and discover how neighborhood green spaces contribute to a healthier city.",

        registration: {
            opens: null,
            closes: null,
            status: "opening-soon"
        },

        image: "./img/modal/events/parks/playground-one-forty.jpg",
        status: "coming-soon",
        featured: false,

       tags: []
    },
    {
        id: "alley-pond",
        name: "Trees Count! at Alley Pond Park",
        park: "Alley Pond Park",
        borough: "queens",
        boroughName: "Queens",
        season: "fall",

        date: "2026-10-10",
        startTime: "10:00 AM",
        endTime: "1:00 PM",

        address: "",
        meetingPoint: "",

        description:
            "Help us document the trees around your community and discover how neighborhood green spaces contribute to a healthier city.",

        registration: {
            opens: null,
            closes: null,
            status: "opening-soon"
        },

        image: "./img/modal/events/parks/alley-pond-park.jpg",
        status: "coming-soon",
        featured: false,

        tags: []
    },

    {
        id: "thomas-jefferson",
        name: "Trees Count! at Thomas Jefferson Park",
        park: "Thomas Jefferson Park",
        borough: "manhattan",
        boroughName: "Manhattan",
        season: "fall",

        date: "2026-10-24",
        startTime: "10:00 AM",
        endTime: "1:00 PM",

        address: "",
        meetingPoint: "",

        description:
            "Help us count and document the trees at Thomas Jefferson Park. Your participation helps build a better understanding of Manhattan's urban forest.",

        registration: {
            opens: null,
            closes: null,
            status: "opening-soon"
        },

        image: "./img/modal/events/parks/thomas-jefferson-park.jpg",
        status: "coming-soon",
        featured: false,

        tags: []
    }


].map(event => {

    // Identify special events using their tags
    const isSpecialEvent = event.featured === true;

    return {

        ...event,

        // Generate names for regular events
        name: isSpecialEvent
            ? event.name
            : `Trees Count! at ${event.park}`,

        // Generate descriptions for regular events
        description: isSpecialEvent
            ? event.description
            : `Help us count and document trees at ${event.park}. Your participation helps build a better understanding of ${event.boroughName}'s urban forest.`,

        // Default values
        date: event.date || "TBD",
        startTime: event.startTime || "",
        endTime: event.endTime || "",

        address: event.address || "",
        meetingPoint: event.meetingPoint || "",

        image: event.image || "",

        status: event.status || "coming-soon",

        tags: event.tags || []

    };

});



// ========================================
// POPULATE REGISTRATION EVENT DROPDOWNS
// ========================================

// Get both event dropdowns
const eventSelects = [
    document.getElementById("individual-event-select"),
    document.getElementById("small-group-event-select")
].filter(Boolean);


// Only include events accepting registrations
const availableEvents = events.filter(event =>
    event.status !== "completed" &&
    event.registration?.status === "open"
);


// ========================================
// FORMAT EVENT DATES
// ========================================

function formatEventDate(dateString, longFormat = false) {

    if (!dateString || dateString === "TBD") {
        return "Date to be announced";
    }

    const date = new Date(`${dateString}T12:00:00`);

    return new Intl.DateTimeFormat("en-US", {

        month: longFormat ? "long" : "short",
        day: "numeric",
        year: "numeric",

        ...(longFormat && {
            weekday: "long"
        })

    }).format(date);

}

// Populate both dropdowns
function populateEventSelects(selectedEventId = "") {

    eventSelects.forEach(select => {

        // Clear existing options
        select.replaceChildren();

        // Add placeholder
        const placeholder = new Option(
            "Select an upcoming event",
            ""
        );

        placeholder.disabled = true;
        select.add(placeholder);

        // Add available events
        availableEvents.forEach(event => {

            const option = new Option(
                `${event.name} — ${formatEventDate(event.date)}`,
                event.id
            );

            select.add(option);

        });

        // Preselect an event if one was provided
        select.value = availableEvents.some(
            event => event.id === selectedEventId
        ) ? selectedEventId : "";

    });

}



// ========================================
// RESET REGISTRATION FLOW
// ========================================

function resetRegistrationFlow(selectedEventId = "") {

    // Return to registration type selection
    registrationSelection.hidden = false;
    registrationFormScreen.hidden = true;

    // Clear the selected registration type
    registrationTypes.forEach(radio => {
        radio.checked = false;
    });

    // Hide and disable all registration forms
    Object.values(registrationForms).forEach(form => {
        form.hidden = true;
        form.disabled = true;
    });

    // Populate dropdowns and optionally preselect an event
    populateEventSelects(selectedEventId);

}



// ========================================
// BOROUGH FILTERS
// ========================================

const boroughTabs = document.querySelectorAll(".borough-tab");

boroughTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        // Get selected borough
        const selectedBorough = tab.dataset.borough;

        // Update active tab
        boroughTabs.forEach(button => {

            button.classList.remove("active");
            button.setAttribute("aria-selected", "false");

        });

        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        // Filter events
        const filteredEvents = selectedBorough === "all"
            ? events
            : events.filter(event =>
                event.borough === selectedBorough
            );

        // Close any expanded event before changing the listings
        displayEvents(filteredEvents);

    });

});





// ========================================
// DISPLAY EVENT CARDS
// ========================================

const eventListings = document.querySelector("#event-listings");
const eventTemplate = document.querySelector("#event-card-template");


// ========================================
// GET PARK LOCATION
// ========================================

function getParkLocation(event) {

    const boroughName = event.borough
        ? event.borough === "staten-island"
            ? "Staten Island"
            : event.borough.charAt(0).toUpperCase() +
              event.borough.slice(1)
        : "";

    return boroughName
        ? `${event.park}, ${boroughName}`
        : event.park;
}


// ========================================
// CREATE ONE EVENT CARD
// ========================================

function createEventCard(event, detailsPanelId) {

    // Clone the HTML template
    const clone = eventTemplate.content.cloneNode(true);

    const card = clone.querySelector(".event-card");
    
    if (event.status === "coming-soon") {
    card.classList.add("coming-soon-event");
}

    if (event.status === "completed") {
    card.classList.add("completed-event");
}

    // ------------------------------------
    // EVENT IMAGE
    // ------------------------------------

    const imageContainer =
        card.querySelector(".event-card-image");

    const image =
        card.querySelector(".event-card-image img");

    if (event.image) {

        image.src = event.image;
        image.alt = `View of ${event.park}`;

    } else {

        imageContainer.hidden = true;

    }


    // ------------------------------------
    // EVENT NAME
    // ------------------------------------

    card.querySelector(".event-name").textContent =
        event.name;


    // ------------------------------------
    // EVENT TAGS
    // ------------------------------------

    const tagsContainer = card.querySelector(".event-tags");

    if (tagsContainer) {
        // Clear tags left over from a previously displayed event
        tagsContainer.innerHTML = "";

        event.tags?.forEach(tag => {
            const tagElement = document.createElement("span");

            tagElement.classList.add(
                "event-tag",
                `event-tag-${tag.type}`
            );

            tagElement.textContent = tag.label;

            tagsContainer.appendChild(tagElement);
        });
    }

    
// ------------------------------------
// SPECIAL EVENT STAR
// ------------------------------------

const specialStar = card.querySelector(".event-special-star");

if (specialStar) {
    const hasSpecialTag = event.tags?.some(tag =>
        tag.type === "event" || tag.type === "guest"
    ) ?? false;

    specialStar.hidden = !hasSpecialTag;
}

    // ------------------------------------
    // EVENT DATE
    // ------------------------------------

    card.querySelector(".event-date").textContent =
        `📅 ${formatEventDate(event.date)}`;


    // ------------------------------------
    // EVENT LOCATION
    // ------------------------------------

    card.querySelector(".event-location").textContent =
        `📍 ${getParkLocation(event)}`;


    // ------------------------------------
    // EXTRACT SHARED DETAILS PANEL
    // ------------------------------------

    const details =
        card.querySelector(".event-details");

    if (details) {

        details.id = detailsPanelId;
        details.hidden = true;

        // Remove it from the individual card.
        // displayEvents() will place it under the row.
        details.remove();

    }


// ========================================
// MORE INFO BUTTON
// ========================================

const moreInfoButton =
    card.querySelector(".event-more-info");

if (moreInfoButton) {

    // Remove More Info for completed and coming-soon events
    if (
        event.status === "completed" ||
        event.status === "coming-soon"
    ) {

        moreInfoButton.remove();

    } else {

        moreInfoButton.dataset.eventId = event.id;

        moreInfoButton.setAttribute(
            "aria-expanded",
            "false"
        );

        moreInfoButton.setAttribute(
            "aria-controls",
            detailsPanelId
        );

        moreInfoButton.textContent = "More Info ↓";

    }
}


// ========================================
// REGISTRATION BUTTON / STATUS LABEL
// ========================================

const registrationStatus =
    event.registration?.status || "closed";

const registerButton =
    card.querySelector(".event-register");

if (registerButton) {

    // COMPLETED EVENT
    if (event.status === "completed") {

        const label = document.createElement("span");

        label.classList.add("event-status-label", "completed");
        label.textContent = "✓ Event Completed";

        registerButton.replaceWith(label);
        card.appendChild(label);

    }

    // REGISTRATION OPEN
    else if (registrationStatus === "open") {

        registerButton.dataset.eventId = event.id;
        registerButton.disabled = false;
        registerButton.textContent = "Register";

    }

    // REGISTRATION OPENING SOON
    else if (registrationStatus === "opening-soon") {

        const label = document.createElement("span");

        label.classList.add("event-status-label", "coming-soon");
        label.textContent = "Coming Soon!";

        registerButton.replaceWith(label);
        card.appendChild(label);

    }

    // REGISTRATION CLOSED
    else {

        const label = document.createElement("span");

        label.classList.add("event-status-label", "registration-closed");
        label.textContent = "Registration Closed";

        registerButton.replaceWith(label);
        card.appendChild(label);

    }
}


    // Return the card and its details panel
    return {
        card: clone,
        details: details
    };

}



// ========================================
// UPDATE EVENT DETAILS PANEL
// ========================================

function updateEventDetails(details, event) {

     // Save the selected event ID
    details.dataset.eventId = event.id;

    // UPDATE EVENT TAGS
    const tagsContainer = details.querySelector(".event-tags");

    if (tagsContainer) {
        tagsContainer.replaceChildren();

        event.tags?.forEach(tag => {
            const tagElement = document.createElement("span");

            tagElement.classList.add(
                "event-tag",
                `event-tag-${tag.type}`
            );

            tagElement.textContent = tag.label;

            tagsContainer.appendChild(tagElement);
        });

        // Hide the container if there are no tags
        tagsContainer.hidden = !event.tags?.length;
    }

    // Event-specific heading
    details.querySelector(".event-details-title").textContent =
        `Event: ${event.name}`;

    // Event description
    const description =
        details.querySelector(".event-detail-description");

    description.textContent = event.description || "";
    description.hidden = !event.description;


    // Full event date
    details.querySelector(".event-detail-date").textContent =
        `📅 ${formatEventDate(event.date, true)}`;


    // Event time
    details.querySelector(".event-detail-time").textContent =
        event.startTime
            ? `🕒 ${event.startTime}${event.endTime ? ` – ${event.endTime}` : ""}`
            : "🕒 Time to be announced";


    // Event address
    const address =
        details.querySelector(".event-detail-address");

    address.textContent = event.address
        ? `📍 Address: ${event.address}`
        : "📍 Address to be announced";

    address.hidden = false;


    // Meeting point
    const meeting =
        details.querySelector(".event-detail-meeting");

    meeting.textContent = event.meetingPoint
        ? `🚩 Meeting Point: ${event.meetingPoint}`
        : "🚩 Meeting point to be announced";

    meeting.hidden = false;

}


// ========================================
// DISPLAY EVENT LISTINGS
// ========================================

function displayEvents(eventArray) {

    // Sort events chronologically:
    // Upcoming/current events first, completed events last
    eventArray = [...eventArray].sort((a, b) => {

        // Keep completed events at the bottom
        if (a.status === "completed" && b.status !== "completed") {
            return 1;
        }

        if (a.status !== "completed" && b.status === "completed") {
            return -1;
        }

        // Put events without confirmed dates last
        const dateA = a.date === "TBD" ? "9999-12-31" : a.date;
        const dateB = b.date === "TBD" ? "9999-12-31" : b.date;

        return dateA.localeCompare(dateB);

    });


    // Remove previously generated rows and placeholders
    eventListings
        .querySelectorAll(".event-row, .events-placeholder")
        .forEach(element => element.remove());


    // ------------------------------------
    // EMPTY RESULTS
    // ------------------------------------

    if (eventArray.length === 0) {

        const message = document.createElement("p");

        message.classList.add("events-placeholder");

        message.textContent =
            "No events found in this borough.";

        eventListings.appendChild(message);

        return;

    }

    // ------------------------------------
    // CREATE ROWS OF TWO EVENT CARDS
    // ------------------------------------

    for (let i = 0; i < eventArray.length; i += 2) {

        const row = document.createElement("div");
        row.classList.add("event-row");


        // Container for event cards
        const cardsContainer = document.createElement("div");
        cardsContainer.classList.add("event-cards");

        row.appendChild(cardsContainer);


        // Get the next two events
        const rowEvents = eventArray.slice(i, i + 2);


        // Shared details panel for this row
        let rowDetails = null;

        const detailsPanelId =
            `event-details-row-${i / 2}`;


        // Create each event card
        rowEvents.forEach(event => {

            const result =
                createEventCard(event, detailsPanelId);

            if (!rowDetails && result.details) {
                rowDetails = result.details;
            }

            cardsContainer.appendChild(result.card);

        });

        // Add the shared details panel underneath the cards
        if (rowDetails) {
            row.appendChild(rowDetails);
        }

        // Add the completed row to the page
        eventListings.appendChild(row);

    }

}

// ========================================
// INITIAL EVENT DISPLAY
// ========================================

// Display all events (sorting happens inside displayEvents)
displayEvents(events);


// ========================================
// EVENT CARD REGISTRATION BUTTONS
// ========================================

eventListings.addEventListener("click", (e) => {

    const button = e.target.closest(".event-register");

    if (!button) return;

    // Find the selected event
    const selectedEvent = events.find(
        event => event.id === button.dataset.eventId
    );

    if (!selectedEvent) return;

    // Only allow events with open registration
    if (!availableEvents.some(
        event => event.id === selectedEvent.id
    )) {
        return;
    }

    // Open registration with this event preselected
    resetRegistrationFlow(selectedEvent.id);

    openVolunteerModal("register");

});


// ========================================
// EVENT DETAILS TOGGLE
// ========================================

eventListings.addEventListener("click", (e) => {

    const button = e.target.closest(".event-more-info");

    if (!button) return;

    const eventId = button.dataset.eventId;

    const row = button.closest(".event-row");

    // Find the shared details panel for this row
    const details = row.querySelector(".event-details");

    if (!details) return;


    // Find the selected event from the full event list
    const selectedEvent = events.find(
        event => event.id === eventId
    );

    if (!selectedEvent) return;


    // Check whether this exact event is already open
    const isAlreadyOpen =
        !details.hidden &&
        details.dataset.eventId === eventId;


    // Close all expanded details
    eventListings.querySelectorAll(".event-details").forEach(panel => {
        panel.hidden = true;
    });


    // Reset all More Info buttons
    eventListings.querySelectorAll(".event-more-info").forEach(btn => {

        btn.textContent = "More Info ↓";

        btn.setAttribute("aria-expanded", "false");

    });


    // Remove highlight from all event cards
    eventListings.querySelectorAll(".event-card").forEach(card => {
        card.classList.remove("active");
    });

    // If the selected event was already open, leave everything closed
    if (isAlreadyOpen) return;


    // Update the shared panel with the selected event
    updateEventDetails(details, selectedEvent);


    // Open the selected event
    details.hidden = false;

    // Highlight the selected card
    button.closest(".event-card").classList.add("active");

    button.textContent = "Show Less ↑";

    button.setAttribute("aria-expanded", "true");

});


// ========================================
// EVENTS: SCROLL DOWN BUTTON
// ========================================

const eventsPanel = document.getElementById('events-panel');

const eventsScrollCue =
    document.querySelector('.events-scroll-cue');

const boroughSection =
    document.querySelector('.borough-section');

// Hide the arrow
function hideEventsScrollCue() {
    eventsScrollCue.classList.add('is-hidden');
}

// Click arrow to jump to Find an Event
eventsScrollCue.addEventListener('click', () => {

    hideEventsScrollCue();

    boroughSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

});

// Show or hide arrow depending on scroll position
document.addEventListener('scroll', (event) => {

    if (eventsPanel.hidden) return;

    const scrollTarget = event.target;

    // Only respond to scrolling within the events modal
    if (
        eventsPanel.contains(scrollTarget) ||
        scrollTarget.contains?.(eventsPanel)
    ) {

        const scrollPosition = scrollTarget.scrollTop || 0;

        if (scrollPosition > 20) {
            eventsScrollCue.classList.add('is-hidden');
        } else {
            eventsScrollCue.classList.remove('is-hidden');
        }
    }

}, true);



// ========================================
// TREES COUNT LOGO - LEAF POP
// ========================================

const logo = document.querySelector('.logo');
const leafLayer = document.querySelector('.header-leaf-layer');

function createLeafBurst(event) {

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const layerRect = leafLayer.getBoundingClientRect();

    // Get the exact click position within the header
    const centerX = event.clientX - layerRect.left;
    const centerY = event.clientY - layerRect.top;

    const leafCount = Math.floor(Math.random() * 2) + 2;

    for (let i = 0; i < leafCount; i++) {

        const leaf = document.createElement('img');

        leaf.src = './img/icons/fluent-emoji-flat--leaf-fluttering-in-wind.svg';
        leaf.alt = '';
        leaf.className = 'logo-leaf';

        const startRotation = Math.random() * 360 - 180;
        const endRotation = startRotation + (Math.random() * 160 - 80);

        const x = Math.random() * 110 - 55;
        const y = Math.random() * -75 - 15;

        leaf.style.left = `${centerX}px`;
        leaf.style.top = `${centerY}px`;

        leaf.style.setProperty('--start-rotation', `${startRotation}deg`);
        leaf.style.setProperty('--end-rotation', `${endRotation}deg`);
        leaf.style.setProperty('--leaf-x', `${x}px`);
        leaf.style.setProperty('--leaf-y', `${y}px`);

        leaf.style.animationDelay = `${Math.random() * 0.12}s`;

        leafLayer.appendChild(leaf);

        leaf.addEventListener('animationend', () => {
            leaf.remove();
        }, { once: true });
    }
}

logo.addEventListener('click', createLeafBurst);

logo.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();

        createLeafBurst({
            clientX: logo.getBoundingClientRect().left +
                     logo.getBoundingClientRect().width / 2,
            clientY: logo.getBoundingClientRect().top +
                     logo.getBoundingClientRect().height / 2
        });
    }
});