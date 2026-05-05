// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

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
        const date = document.getElementById('res-date').value;
        const time = document.getElementById('res-time').value;
        const guests = document.getElementById('res-guests').value;
        
        const reservation = {
            id: Date.now(),
            name,
            date,
            time,
            guests,
            status: 'pending' // En attente
        };
        
        // Sauvegarde dans le localStorage (simulation base de données)
        let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        reservations.push(reservation);
        localStorage.setItem('reservations', JSON.stringify(reservations));
        
        // Préparation et déclenchement de l'email vers le restaurateur
        const emailRestaurateur = "restaurant@paradis-avignon.fr";
        const subject = encodeURIComponent(`Nouvelle Réservation : ${name} le ${date}`);
        const body = encodeURIComponent(`Bonjour,\n\nUne nouvelle réservation a été effectuée sur votre site web :\n\n- Nom : ${name}\n- Date : ${date}\n- Heure : ${time}\n- Nombre de couverts : ${guests}\n\nRetrouvez le détail dans votre Espace Restaurateur.\n\nCordialement,\nLe système de réservation`);
        
        window.location.href = `mailto:${emailRestaurateur}?subject=${subject}&body=${body}`;
        
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
