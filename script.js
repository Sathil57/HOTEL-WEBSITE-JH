// Mobile Menu Toggle
const btn = document.querySelector("button.mobile-menu-button");
const menu = document.querySelector(".mobile-menu");

if (btn && menu) {
    btn.addEventListener("click", () => {
        menu.classList.toggle("hidden");
    });
}

// Scroll Animation
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                // observer.unobserve(entry.target); // Keep animating or stop? Standard is to animate once.
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    // We didn't add this class to HTML yet, but good for future.
    // Let's add simple fade-in class to major sections in style override or inline.
});


// Dining Page - Simple Cart Logic
let cart = [];

function addToOrder(name, price) {
    cart.push({ name, price });
    updateCartIcon();
    alert(`${name} added to your order!`);
}

function updateCartIcon() {
    const count = document.getElementById('cart-count');
    if (count) {
        count.innerText = cart.length;
        count.classList.add('animate-ping');
        setTimeout(() => count.classList.remove('animate-ping'), 300);
    }
}

function openOrder() {
    const modal = document.getElementById('order-modal');
    const list = document.getElementById('order-items');
    const totalEl = document.getElementById('order-total');

    if (!modal) return;

    list.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center border-b pb-2';
            div.innerHTML = `
                <span>${item.name}</span>
                <div class="flex items-center">
                    <span class="font-bold mr-4">$${item.price}</span>
                    <button onclick="removeFromOrder(${index})" class="text-red-500 hover:text-red-700 text-sm">Remove</button>
                </div>
            `;
            list.appendChild(div);
        });
    }

    totalEl.innerText = '$' + total;
    modal.classList.remove('hidden');
}

function removeFromOrder(index) {
    cart.splice(index, 1);
    openOrder(); // Re-render
    updateCartIcon();
}

function closeOrder() {
    document.getElementById('order-modal').classList.add('hidden');
}

function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }
    alert("Order placed successfully! The kitchen will prepare your food.");
    cart = [];
    updateCartIcon();
    closeOrder();
}

// Booking and Contact System Logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Booking Form
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        document.querySelectorAll('input[type="date"]').forEach(input => input.min = today);

        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = bookingForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            // Gather Data for Admin Panel
            const formData = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                status: 'Pending',
                name: bookingForm.querySelector('input[name="name"]').value,
                email: bookingForm.querySelector('input[name="email"]').value,
                phone: bookingForm.querySelector('input[name="phone"]').value,
                checkIn: bookingForm.querySelector('input[name="checkin"]').value,
                checkOut: bookingForm.querySelector('input[name="checkout"]').value,
                room: bookingForm.querySelector('select[name="room"]').value,
                guests: bookingForm.querySelector('select[name="guests"]').value
            };

            // Save to Server (Node.js) instead of LocalStorage
            fetch('http://localhost:3000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(response => response.json())
                .then(savedBooking => {
                    // Now send email
                    return fetch("https://formsubmit.co/ajax/shevonsmith28@gmail.com", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            _subject: "New Booking Request - Sathil Hotel",
                            name: savedBooking.name,
                            email: savedBooking.email,
                            phone: savedBooking.phone,
                            message: `Booking Request: ${savedBooking.room} for ${savedBooking.guests} people. From ${savedBooking.checkIn} to ${savedBooking.checkOut}.`
                        })
                    });
                })
                .then(() => {
                    alert('Booking Request Sent! Redirecting to status page...');
                    window.location.href = `confirmation.html?id=${formData.id}`;
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Even if node server fails, try local save as fallback? No, user wants backend.
                    alert('Something went wrong. Please check your connection.');
                    btn.innerText = originalText;
                    btn.disabled = false;
                });
        });
    }

    // 2. Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            const formData = new FormData(contactForm);

            fetch("https://formsubmit.co/ajax/shevonsmith28@gmail.com", {
                method: "POST",
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    alert('Message Sent Successfully!');
                    contactForm.reset();
                    btn.innerText = originalText;
                    btn.disabled = false;
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Something went wrong. Please try again.');
                    btn.innerText = originalText;
                    btn.disabled = false;
                });
        });
    }
});

function saveBooking(booking) {
    let bookings = JSON.parse(localStorage.getItem('sathil_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('sathil_bookings', JSON.stringify(bookings));
}

