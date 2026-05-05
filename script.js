// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Gestion de l'annulation via le lien dans l'email
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cancelId = urlParams.get('cancel_id');

    if (cancelId) {
        handleCancellation(cancelId);
    }
});

function handleCancellation(id) {
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const index = reservations.findIndex(r => r.id == id);

    if (index !== -1) {
        const res = reservations[index];
        const resDateTime = new Date(`${res.date}T${res.time}`);
        const now = new Date();

        // Calcul de la différence en heures
        const diffInMs = resDateTime - now;
        const diffInHours = diffInMs / (1000 * 60 * 60);

        if (diffInHours >= 2) {
            if (confirm(`Voulez-vous vraiment annuler votre réservation pour le ${res.date} à ${res.time} ?`)) {
                // On retire la réservation
                reservations.splice(index, 1);
                localStorage.setItem('reservations', JSON.stringify(reservations));
                alert("Votre réservation a été annulée avec succès.");
                // Nettoyer l'URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } else if (diffInHours > 0) {
            alert("Il est trop tard pour annuler cette réservation en ligne (moins de 2 heures avant). Veuillez nous appeler directement.");
        } else {
            alert("Cette réservation est déjà passée.");
        }
    } else {
        alert("Réservation introuvable ou déjà annulée.");
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Si le menu mobile est ouvert, on le ferme
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });
});

// Menu hamburger (Mobile)
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        // Logique simplifiée pour le menu mobile
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'white';
            navLinks.style.padding = '2rem 0';
            navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        }
    });
}

// Logique de Réservation
const resForm = document.getElementById('reservation-form');
const resMessage = document.getElementById('reservation-message');
const resDateInput = document.getElementById('res-date');

if (resDateInput) {
    // Empêcher de sélectionner une date passée
    const today = new Date().toISOString().split('T')[0];
    resDateInput.setAttribute('min', today);
}

if (resForm) {
    resForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('res-name').value;
        const email = document.getElementById('res-email').value;
        const date = document.getElementById('res-date').value;
        const time = document.getElementById('res-time').value;
        const guests = document.getElementById('res-guests').value;

        const reservation = {
            id: Date.now(),
            name,
            email,
            date,
            time,
            guests,
            status: 'pending' // En attente
        };

        // Sauvegarde dans le localStorage (simulation base de données)
        let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        reservations.push(reservation);
        localStorage.setItem('reservations', JSON.stringify(reservations));

        // Génération du lien d'annulation
        // window.location.origin + window.location.pathname donne l'URL de base (ex: https://monsite.github.io/restaurant/index.html)
        const cancelUrl = window.location.origin + window.location.pathname + "?cancel_id=" + reservation.id;

        // Envoi des emails via EmailJS (en arrière-plan, sans ouvrir la boite mail du client)
        const templateParams = {
            to_name: name,
            to_email: email,
            res_date: date,
            res_time: time,
            res_guests: guests,
            cancel_url: cancelUrl
        };

        if (typeof emailjs !== 'undefined') {
            // 1. Email de confirmation pour le client
            emailjs.send('service_76r4ycm', 'template_pn02lzn', templateParams)
                .then(() => console.log('Email de confirmation envoyé au client.'))
                .catch((err) => console.error('Erreur email client:', err));

            // 2. Email de notification pour le restaurateur
            emailjs.send('service_76r4ycm', 'template_t2zzi49', templateParams)
                .then(() => console.log('Email de notification envoyé au restaurateur.'))
                .catch((err) => console.error('Erreur email restaurateur:', err));
        }

        // Message de succès
        resForm.reset();
        resMessage.textContent = 'Votre réservation a été confirmée avec succès !';
        resMessage.style.display = 'block';
        resMessage.style.color = '#4ECDC4';

        setTimeout(() => {
            resMessage.style.display = 'none';
        }, 5000);
    });
}
