/*Slider*/

const sliderElements = document.querySelectorAll('.slider-wrapper');

sliderElements.forEach((elem) => {
    const slider = elem.querySelector('.slider');
    const sliderButtons = elem.querySelectorAll('.slider-btn');

    const handleButtons = () => {
        if (!sliderButtons.length) return;
        let scrollVal = Math.round(slider.scrollLeft);
        let maxScrollWidth = slider.scrollWidth - slider.clientWidth;

        sliderButtons[0].style.display = scrollVal > 0 ? 'flex' : 'none';
        sliderButtons[1].style.display = maxScrollWidth > scrollVal + 1 ? 'flex' : 'none';
    }

    handleButtons();

    sliderButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            slider.scrollLeft -= btn.classList.contains('prev') ? 350 : -350;
            setTimeout(() => handleButtons(), 500);
        })
    })
})

/*Carousel*/

const carouselElements = document.querySelectorAll('.carousel-wrapper');

carouselElements.forEach((elem) => {
    const images = elem.querySelectorAll('.carousel-item');
    const dots = elem.querySelectorAll('.dot');

    dots[0].classList.add('active');

    const resetActiveImage = () => {
        images.forEach((image) => {
            image.style.display = 'none'
        })
        dots.forEach((dot) => {
            dot.classList.remove('active')
        })
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', ()=> {
            resetActiveImage();
            dot.classList.add('active');
            images[i].style.display = 'flex';
        })
    })
})