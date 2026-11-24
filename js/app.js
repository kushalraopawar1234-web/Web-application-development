let toastTimeout;

function showToast(message, duration = 3000) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("is-visible");

    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => {
        toast.classList.remove("is-visible");
    }, duration);
}


// Unit price per stand, taken from the Match Schedule table.
const MATCH_PRICES = {
    "match-01": { general: 1500, premium: 3500, vip: 7500 },
    "match-02": { general: 1200, premium: 3000, vip: 6500 },
    "match-03": { general: 1000, premium: 2500, vip: 5500 }
};

// Display names for the stand dropdown values.
const STAND_LABELS = {
    general: "General",
    premium: "Premium",
    vip: "VIP"
};

// 2. Select the form controls using DOM selectors.
const bookingForm = document.querySelector("#book-ticket form");
const matchSelect = document.getElementById("match");
const standSelect = document.getElementById("stand");
const quantityInput = document.getElementById("quantity");

// Nodes of the Booking Summary card that get updated.
const summaryCard = document.getElementById("booking-summary");
const summaryMatch = document.getElementById("summary-match");
const summaryStand = document.getElementById("summary-stand");
const summaryPrice = document.getElementById("summary-price");
const summaryQuantity = document.getElementById("summary-quantity");
const summaryTotal = document.getElementById("summary-total");

let lastAnnounced = "";

function formatRupees(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-IN");
}

function capitalise(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// 3. Read the values the user has chosen.
function readSelection() {
    const matchId = matchSelect.value;
    const stand = standSelect.value;
    const quantity = Math.max(0, Number.parseInt(quantityInput.value, 10) || 0);

    const prices = MATCH_PRICES[matchId] || {};
    const unitPrice = prices[stand] || 0;

    const selectedOption = matchId ? matchSelect.options[matchSelect.selectedIndex] : null;

    return {
        matchId,
        matchLabel: selectedOption ? selectedOption.text : "",
        stand,
        standLabel: STAND_LABELS[stand] || (stand ? capitalise(stand) : ""),
        quantity,
        unitPrice,
        // 4. Total price for the chosen number of tickets.
        total: unitPrice * quantity
    };
}

function updateSummary({ announce = true } = {}) {
    const selection = readSelection();
    const isComplete = Boolean(selection.matchId) && selection.quantity > 0;

    summaryMatch.textContent = selection.matchLabel || "Not selected";
    summaryStand.textContent = selection.standLabel || "Not selected";
    summaryPrice.textContent = formatRupees(selection.unitPrice);
    summaryQuantity.textContent = String(selection.quantity);
    summaryTotal.textContent = formatRupees(selection.total);

    summaryCard.classList.toggle("is-ready", isComplete);

    // 5. Confirm the update with a toast (only when something actually changed).
    const signature = selection.matchId + "|" + selection.stand + "|" + selection.quantity;
    if (announce && isComplete && signature !== lastAnnounced) {
        lastAnnounced = signature;
        showToast(
            selection.quantity + " x " + selection.standLabel + " - " +
            selection.matchLabel + " | Total " + formatRupees(selection.total)
        );
    }

    return selection;
}

if (bookingForm && matchSelect && standSelect && quantityInput && summaryCard) {
    // change = dropdowns and number stepper, input = live typing in the number box.
    matchSelect.addEventListener("change", () => updateSummary());
    standSelect.addEventListener("change", () => updateSummary());
    quantityInput.addEventListener("input", () => updateSummary());
    quantityInput.addEventListener("change", () => updateSummary());

    bookingForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const selection = updateSummary({ announce: false });

        if (!selection.matchId) {
            showToast("Please select a match before confirming.");
            return;
        }
        if (selection.quantity < 1) {
            showToast("Please enter at least one ticket.");
            return;
        }

        showToast(
            "Booking confirmed: " + selection.matchLabel + " - " +
            selection.quantity + " x " + selection.standLabel + " = " +
            formatRupees(selection.total),
            4000
        );
    });

    // Paint the initial state of the summary card.
    updateSummary({ announce: false });
}

document.querySelectorAll('a[href="#book-ticket"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        window.history.pushState(null, "", "#book-ticket");
        document.getElementById("book-ticket").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        if (link.classList.contains("match-book-button")) {
            showToast("Booking form is ready. Select a match to continue.");
        }
    });
});
