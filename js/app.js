// =================================
// CUSTOM CURSOR
// =================================

const customCursor = document.querySelector(".custom-cursor");
const customCursorRing = document.querySelector(".custom-cursor-ring");

if (
    customCursor &&
    customCursorRing &&
    window.matchMedia("(pointer: fine)").matches
) {

    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;


    // Track mouse

    document.addEventListener("mousemove", function (event) {

        mouseX = event.clientX;
        mouseY = event.clientY;

        customCursor.style.left = `${mouseX}px`;
        customCursor.style.top = `${mouseY}px`;

        customCursor.classList.remove("cursor-hidden");
        customCursorRing.classList.remove("cursor-hidden");

    });


    // Smooth ring movement

    function animateCursor() {

        ringX += (mouseX - ringX) * 0.14;
        ringY += (mouseY - ringY) * 0.14;

        customCursorRing.style.left = `${ringX}px`;
        customCursorRing.style.top = `${ringY}px`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();


    // Interactive elements

    const interactiveElements = document.querySelectorAll(
        "a, button, input, textarea"
    );


    interactiveElements.forEach(function (element) {

        element.addEventListener("mouseenter", function () {

            customCursor.classList.add("cursor-hover");
            customCursorRing.classList.add("cursor-hover");

        });


        element.addEventListener("mouseleave", function () {

            customCursor.classList.remove("cursor-hover");
            customCursorRing.classList.remove("cursor-hover");

        });

    });


    // Hide when leaving browser window

    document.addEventListener("mouseleave", function () {

        customCursor.classList.add("cursor-hidden");
        customCursorRing.classList.add("cursor-hidden");

    });


    document.addEventListener("mouseenter", function () {

        customCursor.classList.remove("cursor-hidden");
        customCursorRing.classList.remove("cursor-hidden");

    });

}