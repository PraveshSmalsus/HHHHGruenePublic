import React, { useState, useEffect } from 'react';
import "../src/CSS/Formdata.css";
import axios from 'axios';

const GrueneWeltweitForm = () => {
    const [txtCountry, setTxtCountry] = useState('');
    const [txtOccupation, setTxtOccupation] = useState('');
    const [txtComment, setTxtComment] = useState('');
    const [txtName, setTxtName] = useState('');
    const [txtEmail, setTxtEmail] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [enteredCaptcha, setEnteredCaptcha] = useState('');
    const [isAllowed, setIsAllowed] = useState(false);
    const [status, setStatus] = useState('');
    const serverUrl = 'https://eventservers.onrender.com/api/tableCreationdata';

    useEffect(() => {
        generateCaptcha();
    }, []);
    const generateCaptcha = () => {
        const alphabets = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
        const first = alphabets[Math.floor(Math.random() * alphabets.length)];
        const second = Math.floor(Math.random() * 10);
        const third = Math.floor(Math.random() * 10);
        const fourth = alphabets[Math.floor(Math.random() * alphabets.length)];
        const fifth = alphabets[Math.floor(Math.random() * alphabets.length)];
        const sixth = Math.floor(Math.random() * 10);
        const captchaValue = `${first}${second}${third}${fourth}${fifth}${sixth}`;
        setCaptcha(captchaValue);
        setStatus('');
    };

    const validateEmail = (email) => {
        // Simple email regex pattern
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const checkCaptcha = async () => {
        if (enteredCaptcha === captcha) {
            if (validateEmail(txtEmail)) {
                setIsAllowed(true);
                try {
                    await sendEmailNotification();
                    await addItemClickCount();
                } catch (error) {

                }

            } else {
                setStatus("Invalid email format");
            }
        } else {
            setStatus("Invalid captcha.....");
            setEnteredCaptcha('');
            setIsAllowed(false);

        }
    };
    function getCurrentDateTime() {
        const now = new Date();

        // Define an array of month names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Get the date components
        const day = String(now.getDate()).padStart(2, '0');
        const month = monthNames[now.getMonth()];
        const year = now.getFullYear();

        // Get the time components
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        // Return the formatted date and time
        return `${day} ${month} ${year} ${hours}:${minutes}`;
    }

    // Example usage
    console.log(getCurrentDateTime());

    const sendEmailNotification = async () => {
        const formData = new FormData();
        formData.append("name", txtName);
        formData.append("email", txtEmail);
        formData.append("country", txtCountry);
        formData.append("occupation", txtOccupation);
        formData.append("interest", txtComment);

        try {
            const response = await axios.post("https://gruene-weltweit.de/SPPublicAPIs/php-mailer-api/mail.php", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('FormData:', formData);
            console.log('Response data:', response.data);
            if (response.status === 200) {
                console.log(response.data); // handle success
            } else {
                console.error('Error to send:', response.statusText);
            }
        } catch (error) {
            console.error('Request failed:', error); // handle error
        }
    };



    const addItemClickCount = async () => {
        const postDataArray = [{
            Name: txtName,
            Email: txtEmail,
            Country: txtCountry,
            Occupation: txtOccupation,
            GrueneWeltweitInterested: txtComment,
            Created: getCurrentDateTime()
        }]
        const postData = {
            data: postDataArray,
            tableName: 'FormData'
        };
        try {
            const response = await axios.post(serverUrl, postData);
            console.log('Response status:', response.status);
            console.log('Response data:', response.data);
            if (response.status === 200) {
                console.log(response.data); // handle success
                setStatus('Vielen Dank für Dein Interesse. Wir melden uns bei dir mit Neuigkeiten');
                setTxtCountry('');
                setTxtOccupation('');
                setTxtComment('');
                setTxtName('');
                setTxtEmail('');
                setEnteredCaptcha('');


            } else {
                console.error('Error sending data to server:', response.statusText);
            }


        } catch (error) {
            console.error('Request failed:', error); // handle error
            setStatus('An error occurred while processing your request.');
        }
    };

    return (
        <div className="container">
            <div className="capctha">
                <form className='col-sm-12'>
                    <div className="row">
                        <div className="col-sm-6">
                            <label htmlFor="fname">Name <span className="required-asterisk">*</span></label>
                            <input type="text" id="fname" name="Title" value={txtName} onChange={(e) => setTxtName(e.target.value)} placeholder="Enter Name here.." />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor="lname">Email <span className="required-asterisk">*</span></label>
                            <input type="text" id="lname" name="Email" value={txtEmail} onChange={(e) => setTxtEmail(e.target.value)} placeholder="Enter Email here.." />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor="country">Country</label>
                            <input type="text" id="lname" name="Country" value={txtCountry} onChange={(e) => setTxtCountry(e.target.value)} placeholder="Enter Country here.." />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor="country">Occupation</label>
                            <input type="text" id="lname" name="Occupation" value={txtOccupation} onChange={(e) => setTxtOccupation(e.target.value)} placeholder="Enter Occupation here.." />
                        </div>
                        <div className="col-sm-12">
                            <label htmlFor="subject">Interest in Gruene Weltweit</label>
                            <textarea id="subject" name="subject" value={txtComment} onChange={(e) => setTxtComment(e.target.value)} placeholder="Enter here.." style={{ height: '200px' }}></textarea>
                        </div>
                        <div className="col-sm-12">
                            <div className="mainbody">
                                <div className="row">
                                    <div className="col-sm-5 mt-10">
                                        <input type="text" id="entered-captcha" onPaste={(e) => e.preventDefault()} placeholder="Enter the captcha.." autoComplete="off" value={enteredCaptcha} onChange={(e) => setEnteredCaptcha(e.target.value)} />
                                    </div>
                                    <div className="col-sm-5 mt-10 pad0">
                                        <div className="col valign-middle">
                                            <input type="text" className="text-center searchbox_height" onCopy={(e) => e.preventDefault()} id="generated-captcha" value={captcha} />
                                            <a onClick={generateCaptcha} id="newgen" title="Generate new captcha" className="ms-1">
                                                <img src="https://www.gruene-weltweit.de/PublishingImages/Icons/32/Re-load.png" alt="reload icon" />
                                            </a>
                                            <label className="full_width ml-8"><div id="newstatus" className="c-red">{status}</div></label>
                                        </div>
                                    </div>
                                    <div className="col-sm-2 text-end">
                                        <button type="button" className="btn btn-primary pull-right" disabled={!txtName && !txtEmail} onClick={checkCaptcha}>Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GrueneWeltweitForm;
