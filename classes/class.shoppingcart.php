<?php

namespace Forge\Modules\ForgeShoppingcart;

use \Forge\Core\App\App;
use \Forge\Core\Classes\Utils;
use \Forge\Core\Classes\CollectionItem;
use \Forge\Core\Traits\ApiAdapter;




class Cart {

    public static function trigger() {
        return App::instance()->render(DOC_ROOT.'modules/forge-shoppingcart/templates/', "cart-trigger", [
            'url' => Utils::getUrl(['api', 'forge-shoppingcart', 'get-cart'])
        ]);
    }

    public static function addToButton($item) {
        return App::instance()->render(DOC_ROOT.'modules/forge-shoppingcart/templates/', "add-to-cart", [
            'item' => $item,
            'amount' => 1,
            'url' => Utils::getUrl(['api', 'forge-shoppingcart', 'add-item'])
        ]);
    }

    public static function render() {
        $payment_args = [
            "title" => i('Payment', 'forge-shoppingcart'),
            "label" => i('Checkout', 'forge-shoppingcart'),
            "success" => Utils::getUrl(['']),
            "cancel" => Utils::getUrl(['']),
            'items' => self::getItems(),
            "delivery" => true
        ];

        return App::instance()->render(DOC_ROOT.'modules/forge-shoppingcart/templates/', "cart", [
            'title' => i('Your shopping cart', 'forge-shoppingcart'),
            'items' => self::getItems(),
            'totals' => self::getTotals(),
            'payment_button' => \Forge\Modules\ForgePayment\Payment::button($payment_args),
            'no_items' => i('Your shopping cart is empty', 'forge-shoppingcart')
        ]);
    }

    public static function getTotals() {
        $totals = [];

        $totals[] = [
            'title' => i('Subtotal', 'forge-shoppingcart'),
            'value' => Utils::formatAmount(self::getSubTotal())
        ];

        return $totals;
    }

    public static function getSubTotal() {
        if(self::isEmpty()) {
            return [];
        }
        $amount = 0;
        foreach($_SESSION['shopping_cart'] as $cartitem) {
            $item = new CollectionItem($cartitem['item']);
            $amount+= $item->getMeta('price') * $cartitem['amount'];
        }
        return $amount;
    }

    private static function getItems() {
        if(self::isEmpty()) {
            return [];
        }
        $items = [];
        foreach($_SESSION['shopping_cart'] as $cartitem) {
            $item = new CollectionItem($cartitem['item']);
            $items[] = [
                'collection' => $cartitem['item'],
                'user' => false,
                'title' => $item->getMeta('title'),
                'amount' => $cartitem['amount'],
                'price' => Utils::formatAmount($item->getMeta('price') * $cartitem['amount'])
            ];
        }
        return $items;
    }

    public static function isEmpty() {
        if(! array_key_exists('shopping_cart', $_SESSION)) {
            return true;
        } else {
            if(count($_SESSION['shopping_cart']) == 0) {
                return true;
            }
        }
    }

    public static function addToCart($item, $amount = 1) {
        if(! array_key_exists('shopping_cart', $_SESSION)) {
            $_SESSION['shopping_cart'] = [];
        }

        // check if element already exists
        $existing_element = array_search($item, array_column($_SESSION['shopping_cart'], 'item'));

        if($existing_element !== false) {
            $_SESSION['shopping_cart'][$existing_element]['amount'] += $amount;
        } else {
            $_SESSION['shopping_cart'][] = [
                'amount' => $amount,
                'item' => $item
            ];
        }
        return true;
    }

}