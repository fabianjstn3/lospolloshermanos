document.addEventListener('DOMContentLoaded', () => {

  // --- 1. CONFIGURATION ---
  // We wrap this in a try-catch so if EmailJS fails to load, the rest of the site still works.
  try {
    emailjs.init("qKsuBnK_Tkfr1NDnL");
  } catch (error) {
    console.error("EmailJS failed to load. The form will not work, but the site will render.", error);
  }

  // --- 2. LIGHTBOX LOGIC ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  if (lightbox && lightboxImg) {
    document.querySelectorAll('.menu-item-card img').forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target.id === 'lightbox' || e.target.id === 'lightbox-img') {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // --- 3. JOB DATA ---
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
      skills: ['Speed & accuracy', 'Food safety', 'Teamwork']
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

  // --- 4. RENDER LOGIC ---
  const jobsGrid = document.getElementById('jobs-grid');

  function getFilledJobs() {
    return JSON.parse(localStorage.getItem('filledPositions') || '{}');
  }

  function renderJobs() {
    if (!jobsGrid) return; // Guard clause in case HTML element is missing
    
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
        openApplyModal(e.target.getAttribute('data-job'));
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
      existing.remove();
    } else {
      const div = document.createElement('div');
      div.className = 'more';
      div.style.marginTop = '10px';
      div.innerHTML = `<em>Full Description:</em> ${job.description}<br><strong>Skills:</strong> ${job.skills.join(', ')}`;
      card.appendChild(div);
    }
  }

  // --- 5. APPLICATION FORM LOGIC ---
  // --- 5. APPLICATION FORM LOGIC (WITH CUSTOM OVERLAY) ---
  function openApplyModal(jobId) {
    const job = jobs.find(j => j.id === jobId);
    const card = [...document.querySelectorAll('.job-card')].find(c =>
      c.querySelector(`[data-job="${jobId}"]`)
    );

    // 1. Cleanup existing forms
    const existingForm = card.querySelector('.inline-apply');
    if (existingForm) { existingForm.remove(); return; }
    document.querySelectorAll('.inline-apply').forEach(f => f.remove());

    // 2. Create the form
    const form = document.createElement('form');
    form.className = 'inline-apply';
    form.innerHTML = `
      <h4>Apply for: ${job.title}</h4>
      <label>Full Name</label>
      <input type="text" id="inp-name" name="from_name" required placeholder="Full Name">
      <label>Email</label>
      <input type="email" id="inp-email" name="reply_to" required placeholder="email@address.com">
      <label>Short pitch or CV link</label>
      <textarea id="inp-cv" name="message" rows="3" required placeholder="Why should we hire you?"></textarea>
      <div class="inline-actions">
        <button type="submit" class="cta" id="btn-submit">Apply</button>
        <button type="button" class="cta secondary cancel-inline">Cancel</button>
      </div>
    `;
    card.appendChild(form);

    // Cancel Handler
    form.querySelector('.cancel-inline').addEventListener('click', () => form.remove());

    // 3. SUBMIT HANDLER (Updated for Overlay)
    form.addEventListener('submit', e => {
      e.preventDefault();

      // --- GRAB OVERLAY ELEMENTS ---
      const overlay = document.getElementById('status-overlay');
      const loader = document.getElementById('overlay-loader');
      const title = document.getElementById('overlay-title');
      const msg = document.getElementById('overlay-message');
      const okBtn = document.getElementById('overlay-ok-btn');

      // --- STATE: LOADING ---
      overlay.className = 'overlay-visible'; // Show overlay
      loader.style.display = 'block';        // Show spinner
      okBtn.style.display = 'none';          // Hide OK button
      title.innerText = "Sending...";
      msg.innerText = "Please wait while we process your application.";
      
      // Gather Data
      const templateParams = {
        job_title: job.title,
        job_location: job.location,
        from_name: document.getElementById('inp-name').value,
        reply_to: document.getElementById('inp-email').value,
        message: document.getElementById('inp-cv').value
      };

      const serviceID = "service_vtq31hu";
      const companyTemplateID = "template_pt604nt";
      const applicantTemplateID = "template_vjec73q";
      const publicKey = "qKsuBnK_Tkfr1NDnL"; 

      // Send Email
      emailjs.send(serviceID, companyTemplateID, templateParams, publicKey)
      .then(() => {
          return emailjs.send(serviceID, applicantTemplateID, templateParams, publicKey);
      })
      .then(() => {
        // --- STATE: SUCCESS ---
        loader.style.display = 'none'; // Stop spinner
        title.innerText = "Application Sent!";
        title.style.color = "#2e7d32"; // Green for success
        msg.innerText = `Thank you, ${templateParams.from_name}. We will be in touch shortly.`;
        okBtn.style.display = 'inline-block'; // Show OK button
        okBtn.innerText = "OK, Great!";
        
        // When user clicks OK
        okBtn.onclick = () => {
          overlay.className = 'overlay-hidden'; // Hide overlay
          form.remove(); // Close the form
        };
      })
      .catch((error) => {
        // --- STATE: ERROR ---
        console.error('FAILED...', error);
        loader.style.display = 'none';
        title.innerText = "Connection Failed";
        title.style.color = "#c90a0a"; // Red for error
        msg.innerText = "We couldn't reach the server. Please check your connection or Gmail permissions.";
        okBtn.style.display = 'inline-block';
        okBtn.innerText = "Close";

        // When user clicks Close (on error)
        okBtn.onclick = () => {
          overlay.className = 'overlay-hidden';
          // We do NOT remove the form, so they can try again
        };
      });
    });
  }

  // --- 6. INIT ---
  if (!localStorage.getItem('initSample')) {
    const sample = { 'line-cook': true };
    localStorage.setItem('filledPositions', JSON.stringify(sample));
    localStorage.setItem('initSample', '1');
  }

  renderJobs();
});