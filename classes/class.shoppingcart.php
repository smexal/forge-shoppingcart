<?php

namespace Forge\Modules\ForgeShoppingcart;

use \Forge\Core\App\App;


class Cart {

    public static function trigger() {
        return App::instance()->render(DOC_ROOT.'modules/forge-shoppingcart/templates/', "cart-trigger", [
        ]);
    }

}