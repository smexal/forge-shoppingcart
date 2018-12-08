<?php

namespace Forge\Modules\ForgeShoppingcart;

use Forge\Core\App\App;
use Forge\Core\Abstracts\Module;
use Forge\Core\Classes\Settings;
use Forge\Core\Classes\Fields;
use Forge\Core\Traits\ApiAdapter;

use Forge\Modules\ForgeShoppingcart\Cart;



class ForgeShoppingcart extends Module {
    use ApiAdapter;

    private $apiMainListener = 'forge-shoppingcart';

    public function setup() {
        $this->settings = Settings::instance();
        $this->id = "forge-shoppingcart";
        $this->name = i('Shoppig Cart', 'forge-shoppingcart');
        $this->description = i('Module for shopping cart functionalities.', 'forge-shoppingcart');
        //$this->image = $this->url().'assets/images/...';
    }

    public function start() {
        App::instance()->tm->theme->addStyle(MOD_ROOT . "forge-shoppingcart/css/cart-trigger.less");
        App::instance()->tm->theme->addStyle(MOD_ROOT . "forge-shoppingcart/css/shopping-cart.less");

        App::instance()->tm->theme->addScript($this->url()."scripts/shoppingcart.js", true);

        $this->registerSettings();
    }

    public function addItem($not_used, $data) {
        Cart::addToCart($data['item'], $data['amount']);
        return true;
    }

    public function removeItem($not_used, $data) {
        Cart::removeItem($data['item']);

        return json_encode(['content' => Cart::render()]);
    }

    public function getCart($not_used, $data) {
        return json_encode(['content' => Cart::render()]);
    }

    private function registerSettings() {
        $set = Settings::instance();
        /*$set->registerField(
            Fields::checkbox(array(
                'key' => 'forge-products-has-detail',
                'label' => i('Do products have a detailed view?', 'forge-products'),
                'hint' => i('If this checkbox is activated, the detail view for each product will be available for the users.', 'forge-products')
            ), Settings::get('forge-products-has-detail')), 'forge-products-has-detail', 'left', 'forge-products');""
        */
    }
}

?>
