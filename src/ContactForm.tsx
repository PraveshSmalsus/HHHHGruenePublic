import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../src/CSS/ContactForm.css'; // Import the CSS file for styling
import '../src/CSS/ButtonStyle.css';
import AlertPopup from './AlertPopup';
import { Helmet } from 'react-helmet';
const ContactForm = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    message: '',
    Created: new Date().toISOString().slice(0, 19).replace('T', ' '),
    acceptPrivacyPolicy: false,
    subscribeNewsletter: false,
  });
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [formErrors, setFormErrors]: any = useState({
    email: false,
    acceptPrivacyPolicy: false,
  });
  useEffect(() => {
    setCaptchaText(generateCaptcha());
  }, []); // Empty dependency array ensures it runs once when the component is mounted

  // Update button disabled state when form data changes

  // useEffect(() => {
  //   setIsButtonDisabled(!validateForm());
  // }, [formData, isCaptchaValid]); // Run this check every time formData changes

  // Email validation function
  const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => {
      const updatedData = {
        ...prevState,
        [name]: type === 'checkbox' ? checked : value,
      };

      // Revalidate email whenever input is changed
      if (name === 'email') {
        const isValidEmail = isEmailValid(value);
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          email: value.trim() === '' ? 'empty' : isValidEmail ? false : 'invalid',
        }));
      }

      // Check if the privacy policy checkbox is checked to enable the button
      setIsButtonDisabled(!updatedData.acceptPrivacyPolicy && !isCaptchaValid);

      return updatedData;
    });
  };
  const handleCaptchaChange = (e) => {
    const value = e.target.value;
    setCaptchaInput(value);
    setIsCaptchaValid(value.toLowerCase() === captchaText.toLowerCase());
  };
  // Validate form before submission
  const validateForm = () => {
    const errors = {
      email: formData.email.trim() === '' ? 'empty' : !isEmailValid(formData.email) ? 'invalid' : false,
      acceptPrivacyPolicy: !formData.acceptPrivacyPolicy,
      isCaptchaValid: !isCaptchaValid,
    };
    setFormErrors(errors);
    return !errors.email && !errors.acceptPrivacyPolicy && !errors.isCaptchaValid; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Prevent form submission if there are validation errors
    }

    const apiEndpoint = 'https://gruene-weltweit.de/SPPublicAPIs/insertData.php';

    try {
      // Send POST request with form data
      const response = await axios.post(apiEndpoint, formData);

      // Handle success
      console.log('Form submitted successfully:', response.data);
      setAlertMessage('Vielen Dank für Deine Hilfe!');
      setShowAlert(true);
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        message: '',
        Created: new Date().toISOString().slice(0, 19).replace('T', ' '),
        acceptPrivacyPolicy: false,
        subscribeNewsletter: false,
      });
      setIsButtonDisabled(true); // Disable the button after submit
    } catch (error) {
      // Handle error
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again later.');
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  function generateCaptcha(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < length; i++) {
      captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captcha;
  }
  const refreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    setCaptchaInput('');
    setIsCaptchaValid(false);
  };
  return (
    <>
  <Helmet>
          <title>Grüne weltweit - Kontakt</title>
        </Helmet>
    <div className="contact-form-bg">
      <div className="contact-form-container">
        <h2 className="contact-form-title">Kontakt</h2>
        <form className="contact-form"  name="KonaktForm">
          <div className="input-group">
            <label htmlFor="email">
              E-Mail<span className="text-danger">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input m-0"
            />
            {formErrors.email === 'empty' && (
              <span className="error-text">Das ist ein Pflichtfeld.</span>
            )}
            {formErrors.email === 'invalid' && (
              <span className="error-text">Bitte geben Sie eine gültige E-Mail-Adresse ein.</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="firstName">Vorname</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-input m-0"
            />
          </div>

          <div className="input-group">
            <label htmlFor="lastName">Nachname</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-input m-0"
            />
          </div>

          <div className="input-group">
            <label htmlFor="message">Meine Frage / Mein Anliegen</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="form-input m-0"
              rows={4} // Increase the rows to make the textarea taller
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label gap-1">
              <input
                className=""
                type="checkbox"
                name="acceptPrivacyPolicy"
                checked={formData.acceptPrivacyPolicy}
                onChange={handleChange}
                required
              />
              Ich akzeptiere die <span>
                <a href="/Datenschutz" target="_blank" rel="noopener noreferrer" className="privacy-policy-link">Datenschutzerklärung</a>
              </span>
              <span className="text-danger">*</span>
            </label>
            {formErrors.acceptPrivacyPolicy && (
              <span className="error-text">Das ist ein Pflichtfeld.</span>
            )}
          </div>

          <div className="checkbox-group">
            <label className="align-items-baseline checkbox-label gap-1">
              <input
                className=""
                type="checkbox"
                name="subscribeNewsletter"
                checked={formData.subscribeNewsletter}
                onChange={handleChange}
              />
              <span>Ich will bei Grüne-Weltweit mitmachen. Kontaktiert mich gerne zu Neuigkeiten in meiner Region. (Hinweis zum&nbsp;
                <a href="/Datenschutz" target="_blank" rel="noopener noreferrer" className="privacy-policy-link">Datenschutz</a>)
              </span>
            </label>
          </div>
          <div className="captcha-container">
            <span className="valign-middle">Geben Sie das Wort ein:
              <label htmlFor="captcha" className="captcha-label">
                {captchaText}
              </label>
              <span
                className="captcha-refresh-icon"
                onClick={refreshCaptcha}
                title="CAPTCHA aktualisieren"
              ><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M16.8028 0.55394C12.3641 1.35957 9.3989 2.67104 6.605 5.064C4.08809 7.2198 2.45521 9.5152 1.08484 12.824C0.629632 13.9229 0.692932 14.0664 1.78533 14.4106C2.32563 14.581 2.78366 14.6944 2.803 14.6626C2.82234 14.6308 3.02489 14.13 3.25311 13.5498C5.2682 8.4272 9.4215 4.74453 14.8688 3.2502C16.9568 2.67737 20.7902 2.66489 22.8688 3.22418C26.0462 4.07904 28.2727 5.3077 30.5479 7.4615C32.0222 8.8572 33.8578 11.2667 33.8578 11.8063C33.8578 12.0103 33.3686 12.0553 31.1513 12.0553C28.1711 12.0553 28.2314 12.0317 28.2314 13.1982C28.2314 14.4031 27.9728 14.341 32.9975 14.341H37.5501V9.7696V5.1982H36.4128H35.2754L35.226 7.234L35.1764 9.2699L34.0076 7.7821C30.4693 3.27816 25.3505 0.71904 19.5281 0.54321C18.271 0.50524 17.0446 0.50998 16.8028 0.55394ZM34.5994 24.8465C33.7458 26.9298 32.8496 28.3229 31.3192 29.9456C28.2222 33.2291 24.6347 34.94 19.9647 35.3604C17.7187 35.5626 14.3882 34.9047 11.9462 33.7764C10.2231 32.9803 8.3379 31.653 7.0145 30.3041C5.8905 29.1586 4.14348 26.7574 4.14348 26.3582C4.14348 26.1838 4.77135 26.1189 6.8248 26.0819L9.5061 26.0333L9.5582 24.8465L9.61 23.6597H5.0307H0.451172V28.319V32.9784H1.59403H2.73689V30.8432V28.708L3.3855 29.5684C6.7225 33.9957 11.0238 36.6424 16.0837 37.3822C18.1308 37.6817 21.9388 37.5104 23.7275 37.0387C27.8905 35.9407 31.7384 33.3571 34.3666 29.8957C35.3438 28.6086 36.9382 25.5466 37.1267 24.5954C37.2352 24.0472 37.2197 24.0312 36.3068 23.7603C35.795 23.6082 35.3271 23.4839 35.267 23.4839C35.2069 23.4839 34.9064 24.0971 34.5994 24.8465Z" fill="#008939" />
                </svg>
              </span>

            </span>
            <input
              type="text"
              id="captcha"
              value={captchaInput}
              onChange={handleCaptchaChange}
              placeholder="Geben Sie CAPTCHA ein"
              className="form-control"
            />
            {!isCaptchaValid && captchaInput && (
              <small className="text-danger">Captcha ist falsch</small>
            )}
          </div>

          <button
            type="submit"
            className={`submit-button ${isButtonDisabled ? 'disabled' : ''}`}
            disabled={isButtonDisabled}
            onClick={handleSubmit}
          >
            Absenden
          </button>
        </form>
        {showAlert && <AlertPopup message={alertMessage} onClose={handleCloseAlert} />}
      </div>
    </div>
    </>
  );
};

export default ContactForm;
