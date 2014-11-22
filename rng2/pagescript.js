headerHeight = 0;

function resizeElements()
{
        /* The whole page setup */
        windowWidth = $(window).innerWidth();
        var finalWidth = Math.max(windowWidth, 800);
        $(".whole-page").css("width", finalWidth + "px");

        /* The picture on the top of the page */
        var fixedHeader = document.getElementById("fixed-nav-header");
        headerHeight = fixedHeader.offsetTop;
}

function slideUp()
{
        var target = $(this).attr("href");
        var topOff = ($(target).offset().top - $navHeaderClone.height());
        $("html, body").animate({"scrollTop":topOff+"px"}, 1000);
}

oldColor = 0;
colors = ["white", "grey"];
function colorSlide()
{
        var newColor = (oldColor + 1) % colors.length;
        $(this).css("background", colors[newColor]);
        oldColor = newColor;
}

var imagePos = [[10,10],[210,60]];
var imageInFocus = 0;
function preloadImage(index)
{
        var thumb_url = "images/thumbnails/" + index.toString() +".jpg";
        $(this).src = thumb_url;
}

function startSlideShow()
{
        $(this).children("img").each(preloadImage);
        $(this).children("img").parent().append("<div class=\"small-box\"></div>");
}

function moveBg()
{
        var elemPos = $(this).offset().top;
        var pageHeight = $(document).innerHeight();
        var windowHeight = $(window).innerHeight();
        var windowWidth = $(window).innerWidth();
        var slideHeight = $(this).height();
        var diff = 0;
        var pos = 0;
        var scHeight, scWidth;
        var $bgImage;
        var $slideContent;

        $bgImage = $(this).children(".bgimage");
        $bgImageAlt = $(this).children(".bgimage-alt");
        $slideContent = $(this).children(".slide-content");
        $slideTitle = $(this).children(".slide-title");

        scHeight = $slideContent.height();
        scWidth = $slideContent.width();
        if ((elemPos + slideHeight) > topVal && elemPos < (topVal + windowHeight)) {
                diff = topVal - elemPos;
                if (elemPos >= (topVal + nhHeight)) {
                        $slideTitle.css("top", "10px");
                        $slideTitle.css("left", "10px");
                } else {
                        pos = diff + $navHeaderClone.height() + 10;
                        $slideTitle.css("top", pos.toString() + "px");
                        $slideTitle.css("left", "10px");
                }

                diff = topVal - elemPos;
                pos = Math.floor(-diff/2);
                $bgImage.css("background-position", "0px " + pos.toString() + "px");
                $bgImageAlt.css("background-position", "0px " + pos.toString() + "px");

                pos = (windowHeight - scHeight)/2 + Math.floor(diff/4);
                $slideContent.css("top", pos.toString() + "px");
                pos = (windowWidth - scWidth)/2;
                $slideContent.css("left", pos.toString() + "px");

                diff = elemPos + slideHeight - topVal;
                opa = 1 - (diff/slideHeight);
                $bgImageAlt.css("opacity", opa);

                if ($(this).children("#slideshow").length) {
                        if ((elemPos + slideHeight) < (pageHeight - footerHeight)) {
                        } else {
                                $(this).children("#slideshow").each(startSlideShow);
                        }
                }
        }

        diff = elemPos + slideHeight - topVal - nhHeight;
        if (diff < slideHeight) {
                pos = 0.5 * (1 + diff/slideHeight);
                $slideContent.css("opacity", pos.toString());
        }

        diff = (topVal + windowHeight) - (elemPos);
        if (diff < slideHeight) {
                pos = 0.5 * (1 + diff/slideHeight);
                $slideContent.css("opacity", pos.toString());
        }
}

nhVisible = false;
nhHeight = 0;
slidesLoaded = 0;
loadingSlide = false;
topVal = 0;
footerHeight = 0;

function scrollCheck()
{
        /* Update the position of fixed elements*/
        topVal = $(document).scrollTop();
        if(nhVisible === false && topVal > headerHeight) {
                $navHeaderClone.css("visibility", "visible");
                nhVisible = true;
        } else if (nhVisible === true && topVal <= headerHeight) {
                $navHeaderClone.css("visibility", "hidden");
                nhVisible = false;
        }

        $(".slide").each(moveBg);
}

function mainFunc()
{
        resizeElements();

        $navHeaderClone = $("#fixed-nav-header").clone(true);
        $navHeaderClone.appendTo("body");
        $navHeaderClone.css("position", "fixed");
        $navHeaderClone.css("top", "0px");
        $navHeaderClone.css("z-index", "10");
        $navHeaderClone.css("visibility", "hidden");
        nhHeight = $navHeaderClone.height();
        footerHeight = $("#page-footer").height();

        /* Events */
        $(window).resize(resizeElements);
        $(".nav-btn").click(slideUp);
        $(".slide").each(colorSlide);
        scrollCheck();
        $(document).scroll(scrollCheck);
}

$(document).ready(mainFunc);

