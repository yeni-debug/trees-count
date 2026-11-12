
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

        // Show and enable selected form
        const selectedForm = registrationForms[radio.value];

        if (selectedForm) {
            selectedForm.hidden = false;
            selectedForm.disabled = false;
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


// SUMMER ATTENDANCE QUESTION

const firstTreesCountRadios =
    document.querySelectorAll('input[name="first_trees_count"]');

const summerAttendanceQuestion =
    document.getElementById('summer-attendance-question');

firstTreesCountRadios.forEach((radio) => {

    radio.addEventListener('change', () => {

        const isReturningVolunteer =
            radio.checked && radio.value === 'returning';

        summerAttendanceQuestion.hidden = !isReturningVolunteer;
        summerAttendanceQuestion.disabled = !isReturningVolunteer;

        // Clear the previous answer when hidden
        if (!isReturningVolunteer) {
            summerAttendanceQuestion
                .querySelectorAll('input[type="radio"]')
                .forEach((input) => {
                    input.checked = false;
                });
        }

    });

});

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

smallContactFirst.addEventListener('input', updatePrimaryVolunteer);
smallContactLast.addEventListener('input', updatePrimaryVolunteer);

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

    volunteerCards.forEach((card, index) => {

        const volunteerNumber = index + 2;

        card.querySelector('.volunteer-number').textContent =
            `Volunteer ${volunteerNumber}`;

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


// Remove a volunteer
additionalVolunteers.addEventListener('click', (event) => {

    const removeButton =
        event.target.closest('.remove-volunteer-btn');

    if (!removeButton) {
        return;
    }

    removeButton.closest('.additional-volunteer').remove();

    updateVolunteerNumbers();

});

// ========================================
// SMALL GROUP: MINOR AGREEMENTS
// ========================================

const groupIncludesMinors =
    document.querySelectorAll('input[name="group_includes_minors"]');

const minorAgreements =
    document.getElementById('small-minor-agreements');

groupIncludesMinors.forEach((radio) => {

    radio.addEventListener('change', () => {

        const includesMinors = radio.value === 'yes';

        minorAgreements.hidden = !includesMinors;
        minorAgreements.disabled = !includesMinors;

        // Clear previous answers if the section is hidden
        if (!includesMinors) {
            minorAgreements
                .querySelectorAll('input[type="checkbox"]')
                .forEach((checkbox) => {
                    checkbox.checked = false;
                });
        }

    });

});

// ========================================
// LARGE GROUP: PREFERRED DATES
// ========================================

const preferredDates = [
    document.getElementById('large-date-1'),
    document.getElementById('large-date-2'),
    document.getElementById('large-date-3')
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
// REGISTRATION FORM VALIDATION
// ========================================

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

    if (field.disabled) return true;

    if (!field.checkValidity()) {
        showFieldError(field);
        return false;
    }

    clearFieldError(field);
    return true;
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
// TREES COUNT! EVENT DATA
// ========================================

const events = [

    // ====================================
    // SPECIAL EVENTS
    // ====================================

    {
        id: "highbridge",
        name: "Trees Count! with Urban Park Rangers",
        park: "Highbridge Park",
        borough: "manhattan",

        date: "TBD",
        startTime: "",
        endTime: "",
        address: "",
        meetingPoint: "",

        description:
            "Meet NYC Parks Rangers and learn about the city's wildlife and natural spaces.",

        image: "",

        status: "coming-soon",

        tags: [
            { label: "Special Guest", type: "guest" },
        ]
    },

    {
        id: "fungal-edition",
        name: "Trees Count! - Fungal Edition with NYC Mushroom Network",
        park: "Carl Schurz Park",
        borough: "manhattan",

        date: "TBD",
        startTime: "",
        endTime: "",
        address: "",
        meetingPoint: "",

        description:
            "Discover the fascinating world of fungi with local mushroom enthusiasts.",

        image: "",

        status: "coming-soon",

        tags: [
            { label: "Special Event", type: "event" },
            { label: "Special Guest", type: "guest" }
        ]
    },

    {
        id: "climate-week",
        name: "Trees Count! - Climate Week",
        park: "Prospect Park",
        borough: "brooklyn",

        date: "TBD",
        startTime: "",
        endTime: "",
        address: "",
        meetingPoint: "",

        description:
            "Celebrate Climate Week and discover how trees help create a healthier city.",

        image: "",

        status: "coming-soon",

        tags: [
            { label: "Special Event", type: "event" }
        ]
    },

    {
        id: "city-of-forest",
        name: "Trees Count! - City of Forest Day",
        park: "Crotona Park",
        borough: "bronx",

        date: "TBD",
        startTime: "",
        endTime: "",
        address: "",
        meetingPoint: "",

        description:
            "Celebrate NYC's urban forest through tree activities and community stewardship.",

        image: "",

        status: "coming-soon",

        tags: [
            { label: "Special Event", type: "event" }
        ]
    },

    {
        id: "pineapple-ride",
        name: "Trees Count! with Pineapple Ride",
        park: "Milestone Park",
        borough: "brooklyn",

        date: "TBD",
        startTime: "",
        endTime: "",
        address: "",
        meetingPoint: "",

        description:
            "Join a relaxed community bike ride and explore NYC's parks and neighborhoods.",

        image: "",

        status: "coming-soon",

        tags: [
            { label: "Special Guest", type: "guest" }
        ]
    },


    // ====================================
    // REGULAR TREE CENSUS EVENTS
    // ====================================

    {
        id: "st-marys",
        park: "St. Mary's Park",
        borough: "bronx"
    },
    {
        id: "gilbert-ramirez",
        park: "Gilbert Ramirez Park",
        borough: "brooklyn"
    },
    {
        id: "snug-harbor",
        park: "Snug Harbor",
        borough: "staten-island"
    },
    {
        id: "playground-one-forty",
        park: "Playground One Forty",
        borough: "queens"
    },
    {
        id: "thomas-jefferson",
        park: "Thomas Jefferson Park",
        borough: "manhattan"
    },
    {
        id: "inwood-hill",
        park: "Inwood Hill Park",
        borough: "manhattan"
    },
    {
        id: "clove-lakes",
        park: "Clove Lakes Park",
        borough: "staten-island"
    },
    {
        id: "fountain-of-youth",
        park: "Fountain of Youth Playground",
        borough: "bronx"
    },
    {
        id: "forest",
        park: "Forest Park",
        borough: "queens"
    },
    {
        id: "queens-farm",
        park: "Queens Farm Park",
        borough: "queens"
    },
    {
        id: "alley-pond",
        park: "Alley Pond Park",
        borough: "queens"
    },



].map(event => ({

    // Give regular events their default information
    name: event.name || "Community Tree Census",

    date: event.date || "TBD",
    startTime: event.startTime || "",
    endTime: event.endTime || "",

    address: event.address || "",
    meetingPoint: event.meetingPoint || "",

    description: event.description ||
        "Join your community in counting and documenting NYC's trees.",

    image: event.image || "",

    status: event.status || "coming-soon",

    tags: event.tags || [],

    ...event

}));


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


// Get park name and borough
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


// Fill the shared details panel with the selected event
function updateEventDetails(details, event) {

    const parkLocation = getParkLocation(event);

    details.dataset.eventId = event.id;

    details.querySelector(".event-detail-date").textContent =
        event.date === "TBD"
            ? "📅 Date to be announced"
            : `📅 ${event.date}`;

    details.querySelector(".event-detail-location").textContent =
        `📍 ${parkLocation}`;

    const address = details.querySelector(".event-detail-address");
    address.textContent = event.address
        ? `Address: ${event.address}`
        : "";
    address.hidden = !event.address;

    const meeting = details.querySelector(".event-detail-meeting");
    meeting.textContent = event.meetingPoint
        ? `Meeting Point: ${event.meetingPoint}`
        : "";
    meeting.hidden = !event.meetingPoint;

    const day = details.querySelector(".event-detail-day");
    day.textContent = event.day
        ? `Day: ${event.day}`
        : "";
    day.hidden = !event.day;

    const time = details.querySelector(".event-detail-time");

    time.textContent = event.startTime
        ? `Time: ${event.startTime}${event.endTime ? ` – ${event.endTime}` : ""}`
        : "Time to be announced";
}


function displayEvents(eventArray) {

    // Remove previously generated rows and placeholder
    eventListings.querySelectorAll(".event-row, .events-placeholder")
        .forEach(element => element.remove());


    // Check if there are events to display
    if (eventArray.length === 0) {

        const message = document.createElement("p");

        message.classList.add("events-placeholder");
        message.textContent = "No events found in this borough.";

        eventListings.appendChild(message);

        return;
    }


    // Create rows containing two event cards each
    for (let i = 0; i < eventArray.length; i += 2) {

        const row = document.createElement("div");
        row.classList.add("event-row");

        // Container for the two cards
        const cardsContainer = document.createElement("div");
        cardsContainer.classList.add("event-cards");

        row.appendChild(cardsContainer);

        // Get the next two events
        const rowEvents = eventArray.slice(i, i + 2);

        // One shared details panel for this row
        let rowDetails = null;

        const detailsPanelId = `event-details-row-${i / 2}`;


        rowEvents.forEach(event => {

            // Clone HTML template
            const clone = eventTemplate.content.cloneNode(true);

            const card = clone.querySelector(".event-card");


            // Event image
            const imageContainer = card.querySelector(".event-card-image");
            const image = card.querySelector(".event-card-image img");

            if (event.image) {

                image.src = event.image;
                image.alt = `View of ${event.park}`;

            } else {

                imageContainer.hidden = true;

            }


            // Event name
            card.querySelector(".event-name").textContent = event.name;


            // Event status
            const status = card.querySelector(".event-status");

            status.textContent =
                event.status === "open"
                    ? "Registration Open"
                    : "Coming Soon";

            status.classList.add(`status-${event.status}`);


            // Event tags
            const tagsContainer = card.querySelector(".event-tags");

            if (tagsContainer) {

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


            // Event date
            card.querySelector(".event-date").textContent =
                event.date === "TBD"
                    ? "📅 Date to be announced"
                    : `📅 ${event.date}`;


            // Event location
            card.querySelector(".event-location").textContent =
                `📍 ${getParkLocation(event)}`;


            // Short description
            const description = card.querySelector(".event-description");

            if (event.description) {

                description.textContent = event.description;
                description.hidden = false;

            }


            // Extract the details panel from the first card
            const details = card.querySelector(".event-details");

            if (details) {

                if (!rowDetails) {

                    rowDetails = details;

                    rowDetails.id = detailsPanelId;
                    rowDetails.hidden = true;

                }

                // Remove details from the individual card
                details.remove();

            }


            // More Info button
            const moreInfoButton = card.querySelector(".event-more-info");

            if (moreInfoButton) {

                moreInfoButton.dataset.eventId = event.id;

                moreInfoButton.setAttribute("aria-expanded", "false");

                moreInfoButton.setAttribute(
                    "aria-controls",
                    detailsPanelId
                );

                moreInfoButton.textContent = "More Info ↓";

            }


            // Register button
            const registerButton = card.querySelector(".event-register");

            registerButton.dataset.eventId = event.id;
            registerButton.disabled = event.status !== "open";


            // Add card to the row
            cardsContainer.appendChild(clone);

        });


        // Add the shared details panel underneath both cards
        if (rowDetails) {
            row.appendChild(rowDetails);
        }


        // Add completed row to event listings
        eventListings.appendChild(row);

    }

}
// Display events initially
displayEvents(events);




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


    // If the selected event was already open, leave everything closed
    if (isAlreadyOpen) return;


    // Update the shared panel with the selected event
    updateEventDetails(details, selectedEvent);


    // Open the selected event
    details.hidden = false;

    button.textContent = "Show Less ↑";

    button.setAttribute("aria-expanded", "true");

});
