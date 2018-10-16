var shoppingcart = {
    closing_timeout : false,

    init : function() {
        $("button.add-to-cart").each(function() {
            $(this).unbind('click').on('click', function(e) {
                e.preventDefault();
                shoppingcart.addAction($(this));
            });
        });

        $(".cart-trigger").each(function() {
            $(this).unbind('click').on('click', function(e) {
                e.preventDefault();
                shoppingcart.getCart($(this));
            });
        });
    },

    getCart : function(button) {
        var url = button.data('url');
        button.addClass('loading');
        clearTimeout(shoppingcart.closing_timeout);

        $.ajax({
            method: 'POST',
            url: button.data('url'),
        }).done(function(data) {
            button.removeClass('loading');
            $("#shopping-cart").remove();
            $("body").append(data.content);
            setTimeout(function() {
                $("#shopping-cart").removeClass("s_cart_hide");
            }, 20);
            $(document).keyup(function(e){
                if(e.keyCode === 27) {
                    shoppingcart.close();
                }
            });
            $("#shopping-cart").find(".close").each(function() {
                $(this).unbind('click').on('click', function() {
                    shoppingcart.close();
                });
            });
            $(document).trigger("ajaxReload");
        });

    },

    close : function() {
        $("#shopping-cart").addClass('s_cart_hide');
        clearTimeout(shoppingcart.closing_timeout);
        shoppingcart.closing_timeout = setTimeout(function() {
            $("#shopping-cart").remove();
        }, 500);
    },

    addAction : function(button) {
        var url = button.data('url');
        $(".cart-trigger").each(function() {
            $(this).addClass('loading');
        });
        $.ajax({
            method: 'POST',
            url: button.data('url'),
            data : {
                item: button.data('item'),
                amount: button.data('amount')
            }
        }).done(function(data) {
            $(".cart-trigger").each(function() {
                $(this).removeClass('loading');
                $(this).addClass('updated');
                var trigger = $(this);
                setTimeout(function() {
                    trigger.removeClass('updated');
                }, 1000);
            });
            $(document).trigger("ajaxReload");
        });
    }

}

$(document).ready(shoppingcart.init);
$(document).on("ajaxReload", shoppingcart.init);
$(document).on("hideOverlays", shoppingcart.close);