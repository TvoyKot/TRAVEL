$(function () {
    $('.slider__items').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: '<button type = "button" class = "article-slider__arrow article-slider__arrowleft"><img src="images/svg/arrow-slider-left.svg" alt="arrow left"></button>',
        nextArrow: '<button type = "button" class = "article-slider__arrow article-slider__arrowright"><img src="images/svg/arrow-slider-right.svg" alt="arrow right"></button>'
    })

    $('.menu-btn').on('click', function () {
        $('.menu-btn').toggleClass('menu-btn--active')
    })
})

