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

        $("#shopping-cart").find("a.remove-item").each(function() {
            $(this).on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var button = $(this);

                $.ajax({
                    method: 'POST',
                    url: button.data('url'),
                    data : {
                        item: button.data('remove')
                    }
                }).done(function(data) {
                    var newItems = $(data.content).find(".items").html();
                    var newTotals = $(data.content).find(".totals").html();
                    if(!newTotals) {
                        newTotals = '';
                    }
                    if(newTotals == '') {
                        $("#shopping-cart").find(".actions").remove();
                    }
                    $("#shopping-cart").find(".items").filter(":first").html(newItems);
                    $("#shopping-cart").find(".totals").filter(":first").html(newTotals);

                    $(document).trigger("ajaxReload"); 
                });
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
            var indicator = $(this).find(".amount-indicator");
            indicator.removeClass('hidden');
            indicator.html(parseInt(indicator.html())+1);
        });
        the_amount = button.data('amount');
        if(button.prev().is("#add-to-cart-amount")) {
            the_amount = button.prev().val();
        }
        $.ajax({
            method: 'POST',
            url: button.data('url'),
            data : {
                item: button.data('item'),
                amount: the_amount
            }
        }).done(function(data) {
            if(button.next().is(".add-to-cart-message")) {
                button.next().addClass('visible');
                button.next().html(button.next().attr('data-success'));
                setTimeout(function() {
                    button.next().removeClass('visible');
                    button.next().html('');
                }, 5000);
            }
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