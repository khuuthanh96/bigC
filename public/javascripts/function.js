$(document).ready(function () {
$('.owl-carousel').owlCarousel({
    nav: true,
    navText: ['<i class="ico ico-angle-left"></i>', '<i class="ico ico-angle-right"></i>'],
    dots: false,
    interval: 2000,
    loop: true,
    autoplay: true,
    responsive: {
        0: {
            items: 1
        },
        480: {
            items: 2
        },
        768: {
            items: 3
        },
        992: {
            items: 4
        }
    }
});
});