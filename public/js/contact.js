/* =====================================================
   CONTACT FORM
   TEAM PORTFOLIO
===================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* =================================================
       ELEMENTS
    ================================================= */

    const form =
        document.getElementById("projectForm");

    const details =
        document.getElementById("details");

    const characterCount =
        document.getElementById("characterCount");

    const errorBox =
        document.getElementById("formError");

    const successBox =
        document.getElementById("formSuccess");

    const submitButton =
        document.getElementById("submitBtn");


    /* =================================================
       API BASE URL (no trailing path — endpoint is
       built below so it never gets doubled up)

       WHEN DEPLOYED:
       Change the production URL below.
    ================================================= */

    const API_BASE =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"

            ? "http://localhost:3000"

            : "https://YOUR-BACKEND-URL.onrender.com";

    const API_ENDPOINT =
        `${API_BASE}/api/contact`;


    /* =================================================
       CHARACTER COUNTER
    ================================================= */

    if (details && characterCount) {

        details.addEventListener("input", () => {

            characterCount.textContent =
                details.value.length;

            if (details.value.trim().length >= 20) {

                clearFieldError("details");

            }

        });

    }


    /* =================================================
       CLEAR FIELD ERROR AS USER FIXES IT
    ================================================= */

    ["name", "email", "projectType"].forEach(id => {

        const field =
            document.getElementById(id);

        if (!field) return;

        field.addEventListener("input", () => {
            clearFieldError(id);
        });

        field.addEventListener("change", () => {
            clearFieldError(id);
        });

    });


    /* =================================================
       FORM SUBMIT
    ================================================= */

    if (form) {

        form.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                hideError();

                clearAllFieldErrors();

                successBox.classList.remove(
                    "show"
                );


                /* =====================================
                   HONEYPOT CHECK
                   Real users never fill this field.
                   Silently pretend success to bots.
                ===================================== */

                const honeypot =
                    document.getElementById("website");

                if (honeypot && honeypot.value.trim() !== "") {

                    form.reset();

                    characterCount.textContent = "0";

                    successBox.classList.add("show");

                    return;

                }


                /* =====================================
                   GET FORM VALUES
                ===================================== */

                const name =
                    document
                        .getElementById("name")
                        .value
                        .trim();


                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();


                const company =
                    document
                        .getElementById("company")
                        .value
                        .trim();


                const projectType =
                    document
                        .getElementById("projectType")
                        .value;


                const budgetElement =
                    document.querySelector(
                        'input[name="budget"]:checked'
                    );


                const budget =
                    budgetElement
                        ? budgetElement.value
                        : "";


                const timeline =
                    document
                        .getElementById("timeline")
                        .value;


                const projectDetails =
                    details.value.trim();


                const source =
                    document
                        .getElementById("source")
                        .value;



                /* =====================================
                   VALIDATION (checks every field,
                   not just the first failure)
                ===================================== */

                let firstInvalidField = null;

                if (!name) {

                    setFieldError(
                        "name",
                        "Please enter your name."
                    );

                    firstInvalidField =
                        firstInvalidField || "name";

                }


                if (!email) {

                    setFieldError(
                        "email",
                        "Please enter your email address."
                    );

                    firstInvalidField =
                        firstInvalidField || "email";

                } else if (!isValidEmail(email)) {

                    setFieldError(
                        "email",
                        "Please enter a valid email address."
                    );

                    firstInvalidField =
                        firstInvalidField || "email";

                }


                if (!projectType) {

                    setFieldError(
                        "projectType",
                        "Please select a project type."
                    );

                    firstInvalidField =
                        firstInvalidField || "projectType";

                }


                if (!projectDetails) {

                    setFieldError(
                        "details",
                        "Please tell us a little about your project."
                    );

                    firstInvalidField =
                        firstInvalidField || "details";

                } else if (projectDetails.length < 20) {

                    setFieldError(
                        "details",
                        "Please provide at least 20 characters."
                    );

                    firstInvalidField =
                        firstInvalidField || "details";

                }


                if (firstInvalidField) {

                    showError(
                        "Please fix the highlighted fields below."
                    );

                    focusField(firstInvalidField);

                    return;

                }



                /* =====================================
                   LOADING
                ===================================== */

                setLoading(true);



                try {


                    /* =================================
                       SEND TO BACKEND
                    ================================= */

                    const response =
                        await fetch(
                            API_ENDPOINT,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    name,

                                    email,

                                    company,

                                    projectType,

                                    budget,

                                    timeline,

                                    details:
                                        projectDetails,

                                    source

                                })

                            }
                        );



                    /* =================================
                       READ SERVER RESPONSE
                    ================================= */

                    let result;

                    try {

                        result =
                            await response.json();

                    } catch {

                        result = {
                            message:
                                "The server returned an invalid response."
                        };

                    }



                    /* =================================
                       SERVER ERROR
                    ================================= */

                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Unable to send your inquiry."
                        );

                    }



                    /* =================================
                       SUCCESS
                    ================================= */

                    form.reset();

                    characterCount.textContent =
                        "0";


                    successBox.classList.add(
                        "show"
                    );


                    successBox.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });


                } catch (error) {

                    console.error(
                        "Contact form error:",
                        error
                    );


                    showError(
                        error.message ||
                        "Something went wrong. Please try again."
                    );


                } finally {

                    setLoading(false);

                }

            }
        );

    }



    /* =================================================
       EMAIL VALIDATION
    ================================================= */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }



    /* =================================================
       FIELD-LEVEL ERRORS
    ================================================= */

    function setFieldError(id, message) {

        const group =
            document.getElementById(`${id}Group`);

        const errorEl =
            document.getElementById(`${id}Error`);

        const field =
            document.getElementById(id);

        if (group) group.classList.add("has-error");

        if (errorEl) errorEl.textContent = message;

        if (field) field.setAttribute("aria-invalid", "true");

    }


    function clearFieldError(id) {

        const group =
            document.getElementById(`${id}Group`);

        const errorEl =
            document.getElementById(`${id}Error`);

        const field =
            document.getElementById(id);

        if (group) group.classList.remove("has-error");

        if (errorEl) errorEl.textContent = "";

        if (field) field.removeAttribute("aria-invalid");

    }


    function clearAllFieldErrors() {

        ["name", "email", "projectType", "details"]
            .forEach(clearFieldError);

    }



    /* =================================================
       SHOW GENERAL ERROR
    ================================================= */

    function showError(message) {

        const errorText =
            errorBox.querySelector("span");


        if (errorText) {

            errorText.textContent =
                message;

        }


        errorBox.classList.add("show");


        errorBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }



    /* =================================================
       HIDE GENERAL ERROR
    ================================================= */

    function hideError() {

        errorBox.classList.remove(
            "show"
        );


        const errorText =
            errorBox.querySelector("span");


        if (errorText) {

            errorText.textContent = "";

        }

    }



    /* =================================================
       FOCUS FIELD
    ================================================= */

    function focusField(id) {

        const field =
            document.getElementById(id);


        if (!field) {
            return;
        }


        setTimeout(() => {

            field.focus();

        }, 250);

    }



    /* =================================================
       LOADING STATE
    ================================================= */

    function setLoading(isLoading) {

        if (isLoading) {

            submitButton.disabled = true;

            submitButton.classList.add(
                "loading"
            );

        } else {

            submitButton.disabled = false;

            submitButton.classList.remove(
                "loading"
            );

        }

    }



    /* =================================================
       MOBILE NAVIGATION
       (matches ids used in styles.css / script.js)
    ================================================= */

    const mobileMenuBtn =
        document.getElementById(
            "mobileMenuBtn"
        );


    const mainNav =
        document.getElementById(
            "mainNav"
        );


    if (mobileMenuBtn && mainNav) {


        mobileMenuBtn.addEventListener(
            "click",
            () => {

                const isOpen =
                    mainNav.classList.toggle(
                        "open"
                    );


                const icon =
                    mobileMenuBtn.querySelector(
                        "i"
                    );


                if (isOpen) {

                    icon.classList.remove(
                        "fa-bars"
                    );

                    icon.classList.add(
                        "fa-xmark"
                    );

                    mobileMenuBtn.setAttribute(
                        "aria-label",
                        "Close navigation"
                    );

                } else {

                    icon.classList.remove(
                        "fa-xmark"
                    );

                    icon.classList.add(
                        "fa-bars"
                    );

                    mobileMenuBtn.setAttribute(
                        "aria-label",
                        "Open navigation"
                    );

                }

            }
        );



        mainNav
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        mainNav.classList.remove(
                            "open"
                        );


                        const icon =
                            mobileMenuBtn.querySelector(
                                "i"
                            );


                        icon.classList.remove(
                            "fa-xmark"
                        );


                        icon.classList.add(
                            "fa-bars"
                        );


                        mobileMenuBtn.setAttribute(
                            "aria-label",
                            "Open navigation"
                        );

                    }
                );

            });

    }

});