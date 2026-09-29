// =================================
// FLOATING CURSOR BALL
// =================================

const floatingCursor = document.querySelector(".floating-cursor");

if (
    floatingCursor &&
    window.matchMedia("(pointer: fine)").matches
) {

    let mouseX = 0;
    let mouseY = 0;

    let ballX = 0;
    let ballY = 0;


    // ---------------------------------
    // Mouse movement
    // ---------------------------------

    document.addEventListener("mousemove", function (event) {

        mouseX = event.clientX;
        mouseY = event.clientY;

        floatingCursor.style.opacity = "1";

    });


    // ---------------------------------
    // Smooth floating movement
    // ---------------------------------

    function animateFloatingCursor() {

        ballX += (mouseX - ballX) * 0.12;
        ballY += (mouseY - ballY) * 0.12;

        // Keep the ball slightly beside the pointer

        floatingCursor.style.left = `${ballX + 18}px`;
        floatingCursor.style.top = `${ballY + 18}px`;

        requestAnimationFrame(animateFloatingCursor);
    }

    animateFloatingCursor();


    // ---------------------------------
    // Interactive elements
    // ---------------------------------

    const interactiveElements = document.querySelectorAll(
        "a, button, input, textarea"
    );


    interactiveElements.forEach(function (element) {

        element.addEventListener("mouseenter", function () {

            floatingCursor.classList.add("is-hovering");

            if (
                element.tagName === "BUTTON" ||
                element.classList.contains("header-button") ||
                element.classList.contains("hero-button") ||
                element.classList.contains("about-cta-button") ||
                element.classList.contains("contact-submit")
            ) {

                floatingCursor.classList.add("is-button");

            }

        });


        element.addEventListener("mouseleave", function () {

            floatingCursor.classList.remove("is-hovering");
            floatingCursor.classList.remove("is-button");

        });

    });


    // ---------------------------------
    // Hide when mouse leaves page
    // ---------------------------------

    document.addEventListener("mouseleave", function () {

        floatingCursor.style.opacity = "0";

    });


    document.addEventListener("mouseenter", function () {

        floatingCursor.style.opacity = "1";

    });

}
// =================================
// DARK / LIGHT THEME
// =================================

const themeToggle = document.querySelector(".theme-toggle");

if (themeToggle) {

    themeToggle.addEventListener("click", function () {

        const isLight =
            document.documentElement.getAttribute("data-theme") === "light";

        if (isLight) {

            // Switch to dark
            document.documentElement.removeAttribute("data-theme");

            localStorage.setItem(
                "crop-recommender-theme",
                "dark"
            );

            themeToggle.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

        } else {

            // Switch to light
            document.documentElement.setAttribute(
                "data-theme",
                "light"
            );

            localStorage.setItem(
                "crop-recommender-theme",
                "light"
            );

            themeToggle.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );
        }

    });

}
// =================================
// MOBILE NAVIGATION
// =================================

const menuButton = document.querySelector(".menu-button");
const mainNav = document.querySelector(".main-nav");

if (menuButton && mainNav) {

    menuButton.addEventListener("click", function () {

        mainNav.classList.toggle("mobile-menu-open");

        const isOpen =
            mainNav.classList.contains("mobile-menu-open");

        menuButton.setAttribute(
            "aria-expanded",
            isOpen
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    });

}
// =================================
// CROP RECOMMENDATION
// =================================

const recommendationForm =
    document.getElementById("recommendation-form");

const recommendationResult =
    document.getElementById("recommendation-result");

const recommendedCrop =
    document.getElementById("recommended-crop");

const recommendationConfidence =
    document.getElementById("recommendation-confidence");


if (recommendationForm) {

    recommendationForm.addEventListener(
        "submit",
        async function (event) {

            // Stop the browser from refreshing the page
            event.preventDefault();


            // ---------------------------------
            // Get the values from the form
            // ---------------------------------

            const formData = {
                N: Number(
                    document.getElementById("nitrogen").value
                ),

                P: Number(
                    document.getElementById("phosphorus").value
                ),

                K: Number(
                    document.getElementById("potassium").value
                ),

                temperature: Number(
                    document.getElementById("temperature").value
                ),

                humidity: Number(
                    document.getElementById("humidity").value
                ),

                ph: Number(
                    document.getElementById("ph").value
                ),

                rainfall: Number(
                    document.getElementById("rainfall").value
                )
            };


            console.log(
                "Sending data to API:",
                formData
            );


            try {

                // ---------------------------------
                // Send data to FastAPI
                // ---------------------------------

                const response = await fetch(
                    "https://crop-recommender-de0b45bd.fastapicloud.dev/predict",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(formData)
                    }
                );


                // ---------------------------------
                // Convert API response to JS object
                // ---------------------------------

                const data = await response.json();

                console.log(
                    "API response:",
                    data
                );


                // ---------------------------------
                // Check for API errors
                // ---------------------------------

                if (!response.ok) {

                    throw new Error(
                        data.detail ||
                        "Prediction failed."
                    );

                }


                // ---------------------------------
                // Display recommended crop
                // ---------------------------------

                recommendedCrop.textContent =
                    data.recommended_crop;


                // ---------------------------------
                // Display confidence
                // ---------------------------------

                recommendationConfidence.textContent =
                    `${(data.Confidence * 100).toFixed(0)}%`;


                // ---------------------------------
                // Show recommendation result
                // ---------------------------------
                recommendationResult.classList.add("show");

                // Gentle scroll to reveal the result
                window.scrollTo({
                    top: window.scrollY + 130,
                    behavior: "smooth"
                });

                recommendationResult.focus({
                    preventScroll: true
                });
                // ---------------------------------
                // Log prediction
                // ---------------------------------

                console.log(
                    "Recommended crop:",
                    data.recommended_crop
                );

                console.log(
                    "Confidence:",
                    data.Confidence
                );


            } catch (error) {

                console.error(
                    "Recommendation error:",
                    error
                );

            }

        }
    );

}