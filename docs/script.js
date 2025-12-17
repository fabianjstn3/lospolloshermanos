document.addEventListener('DOMContentLoaded', () => {
  //emailjs init
  try {
    emailjs.init("qKsuBnK_Tkfr1NDnL");
  } catch (error) {
    console.error("EmailJS failed to load.", error);
  }

  //2. lightbox
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

  //3. global keydown listener
const applyModal = document.getElementById('apply-modal');
  const applyForm = document.getElementById('apply-form');
  const contactForm = document.getElementById('contact-form');
  const confirmOverlay = document.getElementById('confirm-overlay');

  document.addEventListener('keydown', (e) => {

    if (e.key === 'Escape') {
      if (lightbox && lightbox.classList.contains('open')) {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
      }
      if (confirmOverlay && confirmOverlay.classList.contains('overlay-visible')) {
        closeConfirmModal();
        return; 
      }
      if (applyModal && applyModal.classList.contains('open')) {
        closeApplyModal();
      }
      return;
    }

    if (e.key === 'Enter') {
      const active = document.activeElement;
      
      const isInApplyForm = applyModal && applyModal.classList.contains('open') && applyForm && applyForm.contains(active);
      const isInContactForm = contactForm && contactForm.contains(active);
      
      if (isInApplyForm || isInContactForm) {
          
          if (active && active.tagName === 'TEXTAREA') {
              
              if (e.shiftKey) {
                  
                  return;
              } else {

                  e.preventDefault(); 
                  
                  if (isInApplyForm) applyForm.requestSubmit();
                  else if (isInContactForm) contactForm.requestSubmit();
                  return; 
              }
          }
          
          if ((isInApplyForm && active.id !== 'apply-cancel') || isInContactForm) {
              e.preventDefault(); 
              
              if (isInApplyForm) applyForm.requestSubmit();
              else if (isInContactForm) contactForm.requestSubmit();
          }
      }
    }
  });

  //4. job listings
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
    
    const firstInput = applyModal.querySelector('input, textarea, button');
    if (firstInput) firstInput.focus();
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

  const confirmTitle = document.getElementById('confirm-title');
  const confirmMessage = document.getElementById('confirm-message');
  const confirmCancelBtn = document.getElementById('confirm-cancel');
  const confirmProceedBtn = document.getElementById('confirm-proceed');

  let pendingSubmissionType = null; 
  let pendingSubmissionData = null;

  function showConfirmModal(type, data) {
    pendingSubmissionType = type;
    pendingSubmissionData = data;

    if(confirmOverlay) {
        confirmOverlay.style.zIndex = "100001"; 
        confirmOverlay.className = 'overlay-visible';
    }

    if (type === 'apply') {
      if(confirmTitle) confirmTitle.innerText = "Confirm Job Application";
      if(confirmMessage) confirmMessage.innerText = `Are you sure you want to submit your application for ${data.job_title}?`;
    } else if (type === 'contact') {
      if(confirmTitle) confirmTitle.innerText = "Confirm Inquiry Submission";
      if(confirmMessage) confirmMessage.innerText = `Are you sure you want to send your message?`;
    }
    
    if(confirmProceedBtn) confirmProceedBtn.focus();
  }

  function closeConfirmModal() {
    if(confirmOverlay) confirmOverlay.className = 'overlay-hidden';
    pendingSubmissionType = null;
    pendingSubmissionData = null;
  }
  
  if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', closeConfirmModal);
  }
  
  if (confirmOverlay) {
      confirmOverlay.addEventListener('click', (e) => {
          if (e.target === confirmOverlay) {
              closeConfirmModal();
          }
      });
  }

  if (confirmProceedBtn) {
    confirmProceedBtn.addEventListener('click', () => {
      //1. close confirmation modal immediately
      const type = pendingSubmissionType;
      const data = pendingSubmissionData;
      closeConfirmModal(); 

      //2. if it was an application, close the apply form too
      if (type === 'apply') {
        closeApplyModal();
      }

      //3. trigger actual emailjs logic
      if (type && data) {
        handleFormSubmission(type, data);
      }
    });
  }

  //emailjs handler
  function handleFormSubmission(type, data) {
    const overlay = document.getElementById('status-overlay');
    const loader = document.getElementById('overlay-loader');
    const title = document.getElementById('overlay-title');
    const msg = document.getElementById('overlay-message');
    const okBtn = document.getElementById('overlay-ok-btn');

    overlay.style.zIndex = "100001"; 
    overlay.className = 'overlay-visible'; 
    
    loader.style.display = 'block';        
    okBtn.style.display = 'none';          
    title.innerText = "Sending...";
    title.style.color = "#000";
    msg.innerText = "Please wait while we process your request.";

    let emailPromise;
    let successTitle, successMsg, errorTitle, errorMsg;

    //form config
    if (type === 'apply') {
        const serviceID = "service_vtq31hu";
        const companyTemplateID = "template_pt604nt";
        const applicantTemplateID = "template_vjec73q";
        const publicKey = "qKsuBnK_Tkfr1NDnL";
        
        successTitle = "Application Sent!";
        successMsg = `Thank you, ${data.from_name}. We will be in touch shortly.`;
        errorTitle = "Connection Failed";
        errorMsg = "We couldn't reach the server. Please check your connection.";

        emailPromise = emailjs.send(serviceID, companyTemplateID, data, publicKey)
            .then(() => emailjs.send(serviceID, applicantTemplateID, data, publicKey));

    } else if (type === 'contact') {
        const serviceID = "service_z0tij4p";
        const companyTemplateID = "template_b57936m";
        const publicKey = "muMHg00QK9UwyTOLY";

        successTitle = "Message Received";
        successMsg = `Thank you, ${data.from_name}. We will get back to you shortly.`;
        errorTitle = "Transmission Error";
        errorMsg = "We couldn't reach the server. Please try again later.";
        
        emailPromise = emailjs.send(serviceID, companyTemplateID, data, publicKey);
    }

    emailPromise
      .then(() => {
        loader.style.display = 'none'; 
        title.innerText = successTitle;
        title.style.color = "#2e7d32"; 
        msg.innerText = successMsg;
        okBtn.style.display = 'inline-block';
        okBtn.innerText = (type === 'apply') ? "OK, Great!" : "Return to Site";
        
        if (type === 'contact' && contactForm) contactForm.reset(); 

        okBtn.onclick = () => {
          overlay.className = 'overlay-hidden';
        };
      })
      .catch((error) => {
        console.error('FAILED...', error);
        loader.style.display = 'none';
        title.innerText = errorTitle;
        title.style.color = "#c90a0a";
        msg.innerText = errorMsg;
        okBtn.style.display = 'inline-block';
        okBtn.innerText = "Close";

        okBtn.onclick = () => {
          overlay.className = 'overlay-hidden';
        };
      });
  }

  //6. form event listeners
  
  //job application form
  if (applyForm) {
    applyForm.addEventListener('submit', e => {
      e.preventDefault();

      const formData = {
        job_title: currentJobTitle,
        from_name: document.getElementById('app-name').value,
        reply_to: document.getElementById('app-email').value,
        message: document.getElementById('app-cv').value
      };
      
      //trigger modal
      showConfirmModal('apply', formData);
    });
  }

  //contact form
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const templateParams = {
        job_title: "General Inquiry",     
        from_name: document.getElementById('con-name').value,
        reply_to: document.getElementById('con-email').value,
        message: document.getElementById('con-message').value
      };

      showConfirmModal('contact', templateParams);
    });
  }

  //7. local storage init
  if (!localStorage.getItem('initSample')) {
    const sample = { 'line-cook': true };
    localStorage.setItem('filledPositions', JSON.stringify(sample));
    localStorage.setItem('initSample', '1');
  }

  renderJobs();
  
  //8. mobile nav
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

  //9. leaflet map
const mapElement = document.getElementById('map');

  if (mapElement) {
  
    const initMap = () => {

      if (mapElement.classList.contains('leaflet-container')) return;

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
          <div style="text-align:center; font-family: 'Helvetica Neue', sans-serif;">
            <h3 style="margin:0 0 5px 0; font-size:0.8rem; color:#e6a00f;">${store.name}</h3>
            <p style="margin:0; font-size:0.7rem;"><strong>Manager:</strong> ${store.manager}</p>
            <p style="margin:0; font-size:0.7rem;"><strong>Hours:</strong> ${store.hours}</p>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('mouseover', function (e) { this.openPopup(); });
        marker.on('mouseout', function (e) { this.closePopup(); });
      });

      window.focusStore = function(lat, lng) {
        map.flyTo([lat, lng], 10, {
          animate: true,
          duration: 1.5
        });
      };
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initMap();
          obs.disconnect();
        }
      });
    }, { 
      rootMargin: "200px"
    });

    observer.observe(mapElement);
  }

});