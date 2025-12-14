document.addEventListener('DOMContentLoaded', () => {
  // --- 1. EMAILJS INITIALIZATION ---
  try {
    emailjs.init("qKsuBnK_Tkfr1NDnL");
  } catch (error) {
    console.error("EmailJS failed to load.", error);
  }

  // --- 2. LIGHTBOX LOGIC ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  
  if (lightbox && lightboxImg) {
    document.querySelectorAll('.menu-item-card img').forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
      });
    }
    
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
        }
    });
  }

  // --- 3. JOB LISTINGS LOGIC ---
  const jobs = [
    {
      id: 'asst-manager',
      title: 'Assistant Manager',
      location: 'Downtown Branch',
      status: 'open',
      description: 'Oversee daily operations, ensure quality standards, coordinate shifts.',
      responsibilities: ['Manage staff schedules', 'Quality control', 'Inventory oversight'],
      skills: ['Leadership', 'Customer service', 'Inventory basics']
    },
    {
      id: 'line-cook',
      title: 'Line Cook',
      location: 'Main Kitchen',
      status: 'filled',
      description: 'Prepare menu items according to standard recipes. Maintain cleanliness.',
      responsibilities: ['Cook menu items', 'Maintain temps', 'Prep ingredients'],
      skills: ['Speed & accuracy', 'Food safety', 'Teamwork', 'Culinary techniques', 'Ability to stay calm under pressure']
    },
    {
      id: 'delivery-driver',
      title: 'Delivery Driver',
      location: 'Citywide',
      status: 'open',
      description: 'Deliver orders safely and on time, represent the brand professionally.',
      responsibilities: ['Timely deliveries', 'Customer interaction', 'Vehicle upkeep'],
      skills: ['Navigation', 'Punctuality', 'Communication']
    },
    {
      id: 'front-staff',
      title: 'Front-of-House Staff',
      location: 'All Branches',
      status: 'open',
      description: 'Greet customers, take orders, and keep service fast and friendly.',
      responsibilities: ['Order taking', 'Cash handling', 'Customer care'],
      skills: ['Friendly attitude', 'Cash handling', 'Basic POS']
    }
  ];

  const jobsGrid = document.getElementById('jobs-grid');

  function getFilledJobs() {
    return JSON.parse(localStorage.getItem('filledPositions') || '{}');
  }

  function renderJobs() {
    if (!jobsGrid) return;
    
    jobsGrid.innerHTML = ''; 
    const filled = getFilledJobs();

    jobs.forEach(job => {
      const isFilled = job.status === 'filled' || filled[job.id];
      const card = document.createElement('div');
      card.className = 'job-card';

      card.innerHTML = `
        <h3>${job.title}</h3>
        <div class="chip">${job.location}</div>
        <p style="margin-top:8px;">${job.description}</p>
        <div style="margin-top:10px">
          <strong>Responsibilities:</strong>
          <ul>${job.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>
        <div><strong>Required skills:</strong> ${job.skills.join(', ')}</div>
        <div class="job-actions">
          ${isFilled
            ? `<button class="cta secondary" disabled>Position Filled</button>`
            : `<button class="cta apply-btn" data-job="${job.id}">Apply Now</button>`
          }
          <button class="cta secondary details-btn" data-details="${job.id}">Details</button>
        </div>
      `;
      jobsGrid.appendChild(card);
    });

    attachJobEventListeners();
  }

  function attachJobEventListeners() {
    document.querySelectorAll('.apply-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const jobId = e.target.getAttribute('data-job');
        openApplyModal(jobId);
      });
    });

    document.querySelectorAll('.details-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const jobId = e.target.getAttribute('data-details');
        toggleDetails(jobId, e.target.closest('.job-card'));
      });
    });
  }

  function toggleDetails(jobId, card) {
    const job = jobs.find(j => j.id === jobId);
    const existing = card.querySelector('.more');
  
    if (existing) {
      existing.classList.add('closing');
      existing.addEventListener('animationend', () => {
        existing.remove();
      }, { once: true });
    } else {
      const div = document.createElement('div');
      div.className = 'more';
      div.innerHTML = `
        <div style="border-top: 1px dashed #ccc; margin-bottom: 8px;"></div>
        <em>Full Description:</em> ${job.description}<br>
        <strong>Skills:</strong> ${job.skills.join(', ')}
      `;
      const actions = card.querySelector('.job-actions');
      card.insertBefore(div, actions);
    }
  }

  // --- 4. MODAL & APPLICATION FORM ---
  const applyModal = document.getElementById('apply-modal');
  const applyForm = document.getElementById('apply-form');
  const applyCancelBtn = document.getElementById('apply-cancel');
  let currentJobTitle = ""; 

  function openApplyModal(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (!job || !applyModal) return;

    currentJobTitle = job.title;
    
    const modalTitle = document.getElementById('modal-job-title');
    if(modalTitle) modalTitle.innerText = `Apply for: ${job.title}`;

    applyModal.classList.add('open');
    applyModal.setAttribute('aria-hidden', 'false');
  }

  function closeApplyModal() {
    if (applyModal) {
      applyModal.classList.remove('open');
      applyModal.setAttribute('aria-hidden', 'true');
      if(applyForm) applyForm.reset();
    }
  }

  if (applyCancelBtn) {
    applyCancelBtn.addEventListener('click', closeApplyModal);
  }

  if (applyModal) {
      applyModal.addEventListener('click', (e) => {
          if (e.target === applyModal) {
              closeApplyModal();
          }
      });
  }

  if (applyForm) {
    applyForm.addEventListener('submit', e => {
      e.preventDefault();

      const formData = {
        job_title: currentJobTitle,
        from_name: document.getElementById('app-name').value,
        reply_to: document.getElementById('app-email').value,
        message: document.getElementById('app-cv').value
      };
      
      closeApplyModal();

      const overlay = document.getElementById('status-overlay');
      const loader = document.getElementById('overlay-loader');
      const title = document.getElementById('overlay-title');
      const msg = document.getElementById('overlay-message');
      const okBtn = document.getElementById('overlay-ok-btn');

      overlay.style.zIndex = "999999"; 
      overlay.className = 'overlay-visible'; 
      loader.style.display = 'block';        
      okBtn.style.display = 'none';          
      title.innerText = "Sending...";
      title.style.color = "#000";
      msg.innerText = "Please wait while we process your application.";

      const serviceID = "service_vtq31hu";
      const companyTemplateID = "template_pt604nt";
      const applicantTemplateID = "template_vjec73q";
      const publicKey = "qKsuBnK_Tkfr1NDnL"; 

      emailjs.send(serviceID, companyTemplateID, formData, publicKey)
      .then(() => {
          return emailjs.send(serviceID, applicantTemplateID, formData, publicKey);
      })
      .then(() => {
        loader.style.display = 'none'; 
        title.innerText = "Application Sent!";
        title.style.color = "#2e7d32"; 
        msg.innerText = `Thank you, ${formData.from_name}. We will be in touch shortly.`;
        okBtn.style.display = 'inline-block';
        okBtn.innerText = "OK, Great!";
        
        okBtn.onclick = () => {
          overlay.className = 'overlay-hidden';
        };
      })
      .catch((error) => {
        console.error('FAILED...', error);
        loader.style.display = 'none';
        title.innerText = "Connection Failed";
        title.style.color = "#c90a0a";
        msg.innerText = "We couldn't reach the server. Please check your connection.";
        okBtn.style.display = 'inline-block';
        okBtn.innerText = "Close";

        okBtn.onclick = () => {
          overlay.className = 'overlay-hidden';
        };
      });
    });
  }

  // --- 5. LOCAL STORAGE INIT ---
  if (!localStorage.getItem('initSample')) {
    const sample = { 'line-cook': true };
    localStorage.setItem('filledPositions', JSON.stringify(sample));
    localStorage.setItem('initSample', '1');
  }

  renderJobs();
  
  // --- 6. CONTACT FORM ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const overlay = document.getElementById('status-overlay');
      const loader = document.getElementById('overlay-loader');
      const title = document.getElementById('overlay-title');
      const msg = document.getElementById('overlay-message');
      const okBtn = document.getElementById('overlay-ok-btn');

      overlay.style.zIndex = "999999"; 
      overlay.className = 'overlay-visible';
      loader.style.display = 'block';
      okBtn.style.display = 'none';
      title.innerText = "Sending...";
      title.style.color = "#000";
      msg.innerText = "Please wait while we send your inquiry.";

      const templateParams = {
        job_title: "General Inquiry",     
        from_name: document.getElementById('con-name').value,
        reply_to: document.getElementById('con-email').value,
        message: document.getElementById('con-message').value
      };

      const serviceID = "service_z0tij4p";
      const companyTemplateID = "template_b57936m";
      const publicKey = "muMHg00QK9UwyTOLY";

      emailjs.send(serviceID, companyTemplateID, templateParams, publicKey)
        .then(() => {
          loader.style.display = 'none';
          title.innerText = "Message Received";
          title.style.color = "#2e7d32";
          msg.innerText = `Thank you, ${templateParams.from_name}. We will get back to you shortly.`;
          okBtn.style.display = 'inline-block';
          okBtn.innerText = "Return to Site";

          okBtn.onclick = () => {
            overlay.className = 'overlay-hidden';
            contactForm.reset();
          };
        })
        .catch((error) => {
          console.error('FAILED...', error);
          loader.style.display = 'none';
          title.innerText = "Transmission Error";
          title.style.color = "#c90a0a";
          msg.innerText = "We couldn't reach the server. Please try again later.";
          okBtn.style.display = 'inline-block';
          okBtn.innerText = "Close";

          okBtn.onclick = () => {
            overlay.className = 'overlay-hidden';
          };
        });
    });
  }

  // --- 7. NAVIGATION LOGIC ---
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('nav ul');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('nav ul li a');

  if(hamburger && navMenu && navOverlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      navOverlay.classList.toggle('active');
      document.body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : '';
    });

    navOverlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- 8. LEAFLET MAP LOGIC ---
  if(document.getElementById('map')) {
    
    const southWest = L.latLng(31.0, -120.0); 
    const northEast = L.latLng(37.0, -103.0); 
    const bounds = L.latLngBounds(southWest, northEast);

    const map = L.map('map', {
      center: [34.5, -111.5], 
      zoom: 6,
      minZoom: 6,             
      maxBounds: bounds,      
      maxBoundsViscosity: 1.0 
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri'
    }).addTo(map);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}').addTo(map);

    const goldIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const stores = [
      {
        name: "Albuquerque (HQ)",
        coords: [35.0844, -106.6504],
        manager: "G. Fring",
        hours: "10:00 AM – 10:00 PM"
      },
      {
        name: "Los Angeles Distribution",
        coords: [34.0522, -118.2437],
        manager: "A. Ortega",
        hours: "9:00 AM – 11:00 PM"
      }
    ];

    stores.forEach(store => {
      const marker = L.marker(store.coords, { icon: goldIcon }).addTo(map);

      const popupContent = `
        <div style="text-align:center; 
        font-family: 'Helvetica Neue', sans-serif;">
        <h3 style="margin:0 0 5px 0; 
        font-size:0.8rem; 
        color:#e6a00f;">
        ${store.name}</h3>
        <p style="margin:0; 
        font-size:0.7rem;">
        <strong>Manager:</strong> 
        ${store.manager}</p>
        <p style="margin:0; 
        font-size:0.7rem;">
        <strong>Hours:</strong> 
        ${store.hours}</p>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('mouseover', function (e) {
        this.openPopup();
      });
      marker.on('mouseout', function (e) {
        this.closePopup();
      });
    });

    window.focusStore = function(lat, lng) {
      map.flyTo([lat, lng], 10, {
        animate: true,
        duration: 1.5
      });
    };
  }

});