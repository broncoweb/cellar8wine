/* Age Gate and State Selector Code */
var stateProfileNames = []; /* Create an array with state profile names */
function getCookie(a) {
  var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}
$(function() { // on DOM ready
    var stateSet = getCookie("myState"); // pull the session storage cookie "myState" (stores selected state) into stateSet variable
if (stateSet == null || stateSet == undefined) { // if stateSet is null
        document.cookie = "myState=\'\'"; // then create a session storage cookie myState and make it blank
} else if(stateSet.length > 0){
    var stateUpperCase = stateSet.toUpperCase();
    $('#shopStateSelect').val(stateUpperCase);
    $('#shopStateSelect option[value='+ stateUpperCase +']').prop('selected', 'selected');
}
filterStateProfile(); // run state profile filters on all shopping items.
    var ageGateClicked = getCookie("agClicked"); // pull the session storage cookie "agClicked" (determines whether enter site button  has been clicked)
    if (ageGateClicked !== "yes") { // if yes
        $('#ageGate').css("display", "flex"); // display the age gate
        $('#ageGate').focus(); // focus on the age gate
        $('body').addClass("no-scroll"); // adds no-scroll class to body
    }
});

$(function() { // on DOM ready
    $('#enterButton').on('click', function() { // whenever #enterButton is clicked
        if (getCookie("myState") !== "") { // if myState is not empty
            document.cookie = "agClicked=yes;path=/"; // set agClicked state to yes, cookie path s/b set too
            $('#ageGate').fadeOut('slow'); // fade out the age gate
                document.body.className = ''; // clears any added classes from the body
                var stateSet = getCookie("myState"); // pull the session storage cookie "myState" (stores selected state) into stateSet variable
                var stateUpperCase = stateSet.toUpperCase();
                $('#shopStateSelect').val(stateUpperCase);
                $('#shopStateSelect option[value='+ stateUpperCase +']').prop('selected', 'selected');
            return false // stop page from submitting
        } else {
            $("#ageGateDropdown").focus(); // focus to the state selector
            return false // stop page from submitting
        }
    });
});

$(".dropdown-shipping").change(function() { // whenever a state dropdown changes
    var stateAbbr = $(this).val(); // create a variable with stateAbbr based on the selection
    document.cookie = `myState=${stateAbbr};path=/` // change the myState session cookie to stateAbbr, cookie path s/b set too
    $("#sidebarState").text(getCookie("myState")); // replace sidebarState span's text to myState
    filterStateProfile(); // apply state profile filters
});

// toggle top navigation dropdown menus
$(".cart_menu-link").on("click", function() {
    var dropdownMenu = $(this).siblings('.main_menu-submenu');
    $(".main_menu-submenu, .v65-widgetModalCart-dropdown").slideUp("slow");
    if (typeof dropdownMenu != "undefined") {
        var toggle = $(dropdownMenu).css("display");
        if (toggle == "none") {
            dropdownMenu.slideDown("slow");
        } else {
            dropdownMenu.slideUp("slow");
        };
    }
});
// make sure menu is displayed when resized to desktop
$(window).resize(function() {
    if ($(window).width() > 991) {
        $("#mainMenu, #siteSearch").css("display", "flex");
    }
});

// insert current year in the copyright message and current shipping state in the sidebar
$((function() {
    var d = new Date();
    var y = d.getFullYear();
    $("#copyrightDate").text(" " + y + " ");
    $("#shopStateSelect").val(getCookie("myState"));
}));

// filter carts and brands based on state profile
$((function() {
    $(".brand-state_profile").each(function() {
        $(this).parent().addClass("bsp-" + $(this).text());
        $(this).remove;
    });
}));

function filterStateProfile() {
    stateProfileNames = [];
    $("#dataConsole").load("/data/state-profile-names #nameList", function() {
        $(".stateProfileName").each(function(i) {
            stateProfileNames.push($(this).text());
        });
        $.each(stateProfileNames, function(i, v) {
            var stateNames = []; /* Create an array with state names */
            $("#dataConsole").load("/state-profiles/" + v + " #profileStates", function() {
                $(".stateName").each(function(i) {
                    stateNames.push($(this).text());
                });
                const cartDiv = ".csp-" + v;
                const notesDiv = cartDiv + " + .cant_ship";
                const brandDiv = ".bsp-" + v + " .brand-notice";

                if ($.inArray(getCookie("myState"), stateNames) !== -1) {
                    $(cartDiv).show();
                    $(notesDiv).hide();
                    $(brandDiv).hide();
                } else {
                    $(cartDiv).hide();
                    $(notesDiv).show();
                    $(brandDiv).show();
                }
            });
        });
    });
    $("#shopStateSelect").val(getCookie("myState"));
}

// Scroll buttons
$(".scroll_container-button").on("click", function() {
    const scrollContent = $(this).siblings(".scroll_container-content")[0];
    const scrollOver = ($(this).hasClass("prev")) ? -Math.abs($(scrollContent).width()) : $(scrollContent).width();
    scrollContent.scrollBy({
        left: scrollOver,
        top: scrollOver,
        behavior: "smooth"
    });
});

// Style the WineDirect widgets and add improvements
$(window).on("load", function() {
    //Add webflow classes to Add-to-cart forms. (consider override styling instead)
    $(".v65-widgetProduct-addToCart").addClass("cart-widget");
    $(".v65-widgetAddToCart").addClass("cart-widget-form");
    $(".v65-widgetAddToCart fieldset").addClass("cart-widget-fieldset");
    $(".v65-widgetAddToCart legend").addClass("cart-widget-legend");
    $(".v65-widgetProduct-addToCart-priceWrapper").addClass("cart-widget-info");
    $(".v65-widgetProduct-addToCart-price").addClass("cart-widget-price");
    $(".v65-widgetProduct-addToCart-unitDescription").addClass("cart-widget-unit");
    $(".v65-widgetProduct-addToCart-productSKU").addClass("cart-widget-sku");
    $(".v65-widgetProduct-addToCart-quantity").addClass("cart-widget-quantity");
    $(".v65-widgetProduct-addToCart-quantity input").addClass("cart-widget-quantity-field");
    $(".v65-widgetProduct-addToCart-outOfStockMessage").addClass("outOfStockMessage");
    $(".add-to-cart").addClass("button");
    $(".add-to-cart").addClass("cart_button");
    $(".add-to-cart span").addClass("cart-button-span");

    //override WineDirect attributes on the quantity input box
    $(".v65-widgetProduct-addToCart-quantity input").css("width", "50%");
    $(".v65-widgetProduct-addToCart-button").addClass("cart-widget-submit");

    // Convert quantity field into a number type, add quantity add and subtract buttons and their functionality.
    $('.v65-widgetAddToCart').find('input:text').prop({
        type: "number",
        min: "1"
    });

    $(".v65-widgetProduct-addToCart-quantity").prepend('<a class="cart-widget-quantity-button sub" href="#">Subtract Quantity </a>');
    $(".v65-widgetProduct-addToCart-quantity").append('<a class="cart-widget-quantity-button add" href="#"> Add Quantity</a>');

    $(".cart-widget-quantity-button").click(function() {
        let quantField = $(this).siblings(".cart-widget-quantity-field")[0];
        var quantValue = $(quantField).val();
        ($(this).hasClass("sub") && quantValue > 1) ? quantValue-- : (($(this).hasClass("add")) ? quantValue++ : quantValue);
        $(quantField).val(quantValue);
    });

    //Style login form

    $(".login_widget").children().addClass("login_widget-inner");
    $(".login_widget-inner").children().addClass("cart_menu-link");
    $(".login_widget-inner").children().unwrap();
    $(".cart_menu-link").wrapInner("<div class='cart_menu-link-text'></div>");
    $(".login_widget").children().wrap('<li class="cart_menu-item"></li>');
    $(".login_widget").unwrap();
    $(".login_widget").children().unwrap();

    // Hide pricing for Out of Stock Items
    setTimeout(function() {
        const shopItems = document.querySelectorAll('.shop-items-instance .w-dyn-item')
        shopItems.forEach(item => {
            const widget = item.querySelector('.cart-widget-fieldset');
            if(widget.querySelector('.v65-widgetProduct-addToCart-outOfStockMessage')){
                const spaceDiv = document.createElement('div');
                spaceDiv.style.height = '2.8em';
                item.querySelector('.shop-items-instance-info').append(spaceDiv);
                widget.querySelectorAll('div').forEach(div => div.style.visibility = 'hidden');
                widget.querySelector('.v65-widgetProduct-addToCart-outOfStockMessage').style.visibility = 'visible';
            }
        });
    },4000);
});

// Add .w--current to any classes with a certain path prefix.
$(window).on("load", function() {
    const specialPages = [
        ["shop", "#nav-shop-link"],
        ["brands", "#nav-brands-link"],
        ["news", "#nav-news-link"]
    ];
    specialPages.forEach(function(urlSearch) {
        if (window.location.pathname.indexOf(urlSearch[0]) != -1) {
            $(urlSearch[1]).addClass("w--current");
        }
    });
});

$(".news-share-copy").on("click", function() {
    $(this).prev(".news-share-url").select();
    document.execCommand("copy");
});

$(window).on("load", function() {
    $(".site-title-eight").removeClass("spinning-eight");
});

  //Resize brand heading text sizes on overflow
$(window).on("load", function() {
    $('.brand-name').each(function(i) {
        var brandContainer = $(this).closest('.brand-heading');
        if ($(this).innerWidth() > brandContainer.innerWidth()) {
            $(this).css('font-size', '.75em');
        }
    });
});

//Hide scroll buttons when not needed
$(window).on("load", function() { 
    $('.scroll_container-content').each(function(i) { 
        var scrollContainer = $(this).closest('.scroll_container')[0]; 
        var scrollContent = $(this)[0]; 
        if(scrollContainer.clientWidth > scrollContent.scrollWidth) { 
            $(this).siblings('.scroll_container-button').remove();

        }
    });
});

//Prevent cart item links from firing in the cart widget
$(".cart_menu-item").on("click", ".v65-widgetModalCart-itemSummaryDescription a", () => false );
