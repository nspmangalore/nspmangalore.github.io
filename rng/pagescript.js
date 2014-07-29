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

colors = [ 
"linear-gradient(#1b6303,#0a2c02)",
        "linear-gradient(#61035c,#2e0229)",
        "linear-gradient(#614c03,#2e2702)",
        "linear-gradient(#035061,#02252e)"
        ];

function getRandomColor()
{
        return colors[Math.floor(Math.random() * 4)];
}

bgs = [ 
"background_alpa",
        "background_swan", 
        "background_beng" 
        ];

function getRandomBg()
{
        return bgs[Math.floor(Math.random() * 3)];
}

oldColor = colors[0];
oldBg = bgs[0];

function colorSlide()
{
        var newColor = getRandomColor();
        while (newColor === oldColor) {
                newColor = getRandomColor();
        }
        $(this).css("background", newColor);
        oldColor = newColor;

        var $bgImage = $("<div id=\"bgimage\"></div>");

        var newBg = getRandomBg();
        while (newBg === oldBg) {
                newBg = getRandomBg();
        }
        $bgImage.addClass(" " + newBg);
        oldBg = newBg;

        $(this).append($bgImage);
}

function moveBg(index)
{
        var elemPos = $(this).offset().top;
        var windowHeight = $(window).innerHeight();
        var slideHeight = $(this).height();
        var diff = 0;
        var pos = 0;
        var $bgImage;
        var $slideContent;

        if ((elemPos + slideHeight) > topVal && elemPos < (topVal + windowHeight)) {
                $bgImage = $(this).children("#bgimage");
                diff = elemPos - topVal;
                if (index % 2 == 0) {
                        pos = diff/8;
                } else {
                        pos = -diff/8;
                }
                $bgImage.css("background-position", pos.toString() + "px 0px");
        }

        diff = elemPos + slideHeight - topVal;
        if (diff < slideHeight) {
                $slideContent = $(this).children(".slide-content");
                pos = diff/slideHeight;
                $slideContent.css("opacity", pos.toString());
        }

        diff = (topVal + windowHeight) - (elemPos);
        if (diff < slideHeight) {
                $slideContent = $(this).children(".slide-content");
                pos = diff/slideHeight;
                $slideContent.css("opacity", pos.toString());
        }
}

nhVisible = false;
slidesLoaded = 0;
loadingSlide = false;
topVal = 0;

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

        /* Load more slides if necessary */
        /*
           if (loadingSlide == false && topVal >= ($(document).height()-windowHeight)) {
           loadingSlide = true;
           $("#contact-us").before("<p id=\"dummy-para\">Loading more...</p>");
           $("#dummy-para").each(colorSlide);

           reply = $.get("collectSAMPLE.html", function(data, status){
           slidesLoaded++;
           $("#dummy-para").after(data);
           }, "text/plaintext");

           reply.error(function(jqXHR, textStatus, errorThrown) {
           alert(textStatus);

        // Etc
        });
        $("#dummy-para").remove();
        loadingSlide = false;
        }
         */

        $(".slide").each(moveBg);
}

function mainFunc()
{
        resizeElements();

        $navHeaderClone = $("#fixed-nav-header").clone(true);
        $navHeaderClone.appendTo("body");
        $navHeaderClone.css("position", "fixed");
        $navHeaderClone.css("top", "0px");
        $navHeaderClone.css("z-index", "5");
        $navHeaderClone.css("visibility", "hidden");

        /* Events */
        $(window).resize(resizeElements);
        $(".nav-btn").click(slideUp);
        $(".slide").each(colorSlide);
        scrollCheck();
        $(document).scroll(scrollCheck);
}

$(document).ready(mainFunc);

