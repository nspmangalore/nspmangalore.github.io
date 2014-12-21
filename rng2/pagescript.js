var headerHeight = 0;
var headerTop = 0;

function resizeElements()
{
        /* The whole page setup */
        var windowHeight = $(window).innerHeight();
        var windowWidth = $(window).innerWidth();
        var finalWidth = Math.max(windowWidth, 800);
        $(".whole-page").css("width", finalWidth + "px");

        /* The picture on the top of the page */
        var $fixedHeader = $("#fixed-nav-header");
        headerHeight = $fixedHeader.height();
        headerTop = $fixedHeader.offset().top;

        $("#slideshow-container").height(windowHeight - headerHeight - footerHeight);
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

var imagePos = [[300,0],[300,0]];
var slideShowNotBuilt = 1;
var lastImage = [-200,100];

function positionBoxes(index)
{
        var id = index % imagePos.length;
        newPosX = lastImage[0] + imagePos[id][0];
        newPosY = lastImage[1] + imagePos[id][1];
        $(this).css("left", newPosX);
        $(this).css("bottom", newPosY);
        lastImage[0] = newPosX;
        lastImage[1] = newPosY;
        $(this).css("visibility", "visible");
}

function preloadImage(index)
{
        var thumb_url = "images/thumbnails/" + (index+1).toString() +".jpg";
        $(this).css("background-image", "url("+thumb_url+")");
}

function buildSlideShow()
{
        var smallBoxes = $(this).find(".small-box");
        smallBoxes.each(preloadImage);
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
        var $slideShow;

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

                pos = (slideHeight - scHeight)/2 + Math.floor(diff/4);
                $slideContent.css("top", pos.toString() + "px");
                pos = (windowWidth - scWidth)/2;
                $slideContent.css("left", pos.toString() + "px");

                diff = elemPos + slideHeight - topVal;
                opa = 1 - (diff/slideHeight);
                $bgImageAlt.css("opacity", opa);

                if ($(this).children("#slideshow-container").length) {
                        $slideShow = $(this).children("#slideshow-container");
                        if (slideShowNotBuilt) {
                                $slideShow.each(buildSlideShow);
                                slideShowNotBuilt = 0;
                                lastImage = [0,0];
                        }

                        diff = (elemPos + slideHeight + footerHeight) - (topVal + windowHeight);
                        pos = -(diff * windowWidth) / (topVal + windowHeight);
                        $slideShow.css("bottom", pos.toString() + "px")
                }
        }

        diff = elemPos + slideHeight - topVal - nhHeight;
        if (diff < slideHeight) {
                pos = 0.5 * (1 + diff/slideHeight);
                $slideContent.css("opacity", pos.toString());
                bottomReached = 1;
        } else {
                bottomReached = 0;
        }

        diff = (topVal + windowHeight) - (elemPos);
        if (diff < slideHeight) {
                pos = 0.5 * (1 + diff/slideHeight);
                $slideContent.css("opacity", pos.toString());
        }
}

var nhVisible = false;
var nhHeight = 0;
var slidesLoaded = 0;
var loadingSlide = false;
var topVal = 0;
var footerHeight = 0;

function scrollCheck()
{
        /* Update the position of fixed elements*/
        topVal = $(document).scrollTop();
        if(nhVisible === false && topVal > headerTop) {
                $navHeaderClone.css("visibility", "visible");
                nhVisible = true;
        } else if (nhVisible === true && topVal <= headerTop) {
                $navHeaderClone.css("visibility", "hidden");
                nhVisible = false;
        }

        $(".slide").each(moveBg);
}

var slideShowPos = 0;

function smallBoxOver()
{
        $(this).animate({"top": "-=10"}, 500);
}

function smallBoxOut()
{
        $(this).animate({"top": "+=10"}, 500);
}

function moveLeft()
{
        var $gallery = $(this).parent().find("#slideshow");
        $gallery.animate({scrollLeft: "-=100"}, 500);
        if ($gallery.scrollLeft() <= 0) {
                $gallery.scrollRight = 0;
        }
}

function moveRight()
{
        var $gallery = $(this).parent().find("#slideshow");
        $gallery.animate({scrollLeft: "+=100"}, 500);
        if ($gallery.scrollRight() <= 0) {
                $gallery.scrollLeft = 0;
        }
}

var $images = {};
var imageInFocus = -1;

function hideFullImage(e)
{
        var $image;
        if (imageInFocus == -1) {
                return;
        }

        $image = $images[imageInFocus];
        if (!$image.is(e.target) && 
                $image.has(e.target).length === 0) {
                $image.css("visibility", "hidden");
                imageInFocus = -1;
        }
}

function displayFullImage()
{
        var $image;
        var index = $(".small-box").index($(this));
        var fullUrl = "images/fullsize/" + (index+1).toString() +".jpg";
        var windowHeight = $(window).innerHeight();
        imageInFocus = index;
        if ($images[index]) {
                $image = $images[index];
                $image.css("visibility", "hidden");
        } else {
                $image = $("<div class='full-image'><image src=" + fullUrl + " /></div>");
                $images[index] = $image;
                $image.appendTo("body");
                $image.css("position", "fixed");
                $image.css("z-index", "15");
                $image.css("top", "100px");
                $image.css("left", "100px");
                $image.css("bottom", "100px");
                $image.css("right", "100px");
                $image.css("visibility", "hidden");
        }
        $image.css("visibility", "visible");
}

function spawnHeader()
{
        $navHeaderClone = $("#fixed-nav-header").clone(true);
        $navHeaderClone.appendTo("body");
        $navHeaderClone.css("position", "fixed");
        $navHeaderClone.css("top", "0px");
        $navHeaderClone.css("z-index", "10");
        $navHeaderClone.css("visibility", "hidden");
}

function mainFunc()
{
        spawnHeader();
        nhHeight = $navHeaderClone.height();
        footerHeight = $("#page-footer").height();
        resizeElements();
        $(window).resize(resizeElements);
        $(".slide").each(colorSlide);
        scrollCheck();
        $(document).scroll(scrollCheck);
        $(document).mouseup(hideFullImage);
        $(".small-box").hover(smallBoxOver, smallBoxOut);
        $(".small-box").click(displayFullImage);
        $(".nav-btn").click(slideUp);
        $(".left-arrow").mousedown(moveLeft);
        $(".right-arrow").mousedown(moveRight);
}

$(document).ready(mainFunc);

