# 🍗 Los Pollos Hermanos - Fan Website

A **responsive, interactive front-end website** for the fictional fast-food chain *Los Pollos Hermanos* from the *Breaking Bad* and *Better Call Saul* universe.

This project demonstrates **modern DOM manipulation**, **responsive CSS design**, and **serverless email integration** using EmailJS.

---

## ✨ Features

* **Responsive Design:** Fully adaptive layout for Desktop, Tablet, and Mobile.
* **Menu Lightbox:** Custom JavaScript image viewer for menu items.
* **Dynamic Job Board:**

  * Job listings rendered dynamically via JavaScript objects.
  * Status indicators (Open / Filled).
  * Expandable "Details" view.
* **Functional Application System:**

  * Inline Application Form: Opens directly within the job card.
  * EmailJS Integration: Sends real-time emails to the company and an auto-reply to the applicant.
  * Custom UX Overlay: Loading screen with spinner animation and success/error feedback.

---

## 🛠️ Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square\&logo=html5\&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square\&logo=css3\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square\&logo=javascript\&logoColor=black)
![EmailJS](https://img.shields.io/badge/EmailJS-FF5A5F?style=flat-square\&logo=emailjs\&logoColor=white)

---

## 📂 Project Structure

```
/
├── index.html        # Main HTML structure
├── styles.css        # Global styles, media queries, and overlay CSS
├── script.js         # Logic for Lightbox, Jobs, and EmailJS
├── README.md         # Project documentation
├── images/           # Folder containing project assets
└── fonts/            # Custom fonts (optional)
```

---

## 🚀 Setup & Configuration

### 1. Clone or Download

Download the project files to your local machine.

### 2. EmailJS Configuration (Crucial)

To make the job application forms work, connect your own EmailJS account:

1. Create a free account at [EmailJS](https://www.emailjs.com/).

2. Create a **Service**: Connect your Gmail account (allow "Send email on your behalf").

3. Create **2 Templates**:

   * **Company Template:** Sent to you. Variables: `{{from_name}}`, `{{reply_to}}`, `{{job_title}}`, `{{message}}`
   * **Applicant Template:** Sent to the user. Set "To Email" field to `{{reply_to}}`.

4. Update `script.js`:

```javascript
const serviceID = "YOUR_SERVICE_ID";
const companyTemplateID = "YOUR_COMPANY_TEMPLATE_ID";
const applicantTemplateID = "YOUR_APPLICANT_TEMPLATE_ID";
const publicKey = "YOUR_PUBLIC_KEY";
```

### 3. Run the Project

Open `index.html` in your preferred web browser.

> For best results and to avoid CORS issues, use a local server (e.g., **Live Server** in VS Code).

---

## 🎨 Customization

* **Adding Jobs:** Edit the `jobs` array at the top of `script.js`. HTML updates automatically.
* **Changing Colors:** Edit CSS variables in the `:root` section of `styles.css`.

---

## ⚠️ Disclaimer

This project is a **fan creation for educational and portfolio purposes only**.
*"Los Pollos Hermanos," "Breaking Bad,"* and related characters are trademarks of Sony Pictures Television and AMC.
This site is **not affiliated** with the official copyright holders.

Developed with 🐔 and 🧂.
