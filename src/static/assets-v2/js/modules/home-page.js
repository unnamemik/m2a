/*Copy buttons logic*/

const copyButtons = document.querySelectorAll('.company-card-copy');

const copyContent = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        console.log('Content copied to clipboard');
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

copyButtons.forEach((button) => {
    const textToCopy = button.previousSibling.previousSibling.textContent;

    button.addEventListener('click', (e) => {
        e.preventDefault();
        copyContent(textToCopy);
    })
})

/*Resize fixes*/

const mobileWidth = 590

/*Events carousel fix when resize to desktop*/

window.addEventListener("resize", function(event) {
    let width = document.body.clientWidth;
    if (width > mobileWidth) {
        const eventImages = document.querySelectorAll('.home-event-card');
        eventImages.forEach((elem) => {
            elem.style.display = 'flex';
        })
    }

})