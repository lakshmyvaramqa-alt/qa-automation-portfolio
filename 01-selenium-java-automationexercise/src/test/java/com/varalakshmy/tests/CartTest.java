package com.varalakshmy.tests;

import com.varalakshmy.base.BaseTest;
import com.varalakshmy.pages.CartPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CartTest extends BaseTest {

    @Test
    public void verifyAddProductToCart() {

        CartPage cartPage = new CartPage();

        cartPage.clickProducts();

        cartPage.addFirstProductToCart();

        cartPage.clickCart();

        Assert.assertTrue(
                cartPage.isProductDisplayedInCart(),
                "Product is not displayed in the cart"
        );
    }


    @Test
    public void verifyRemoveProductFromCart() {

        CartPage cartPage = new CartPage();

        cartPage.clickProducts();

        cartPage.addFirstProductToCart();

        cartPage.clickCart();

        cartPage.deleteProductFromCart();

        Assert.assertTrue(
                cartPage.isCartEmpty(),
                "Cart is not empty after removing the product"
        );
    }
    @Test
public void verifyCartPageDisplayed() {

    CartPage cartPage = new CartPage();

    cartPage.clickProducts();

    cartPage.addFirstProductToCart();

    cartPage.clickCart();

    Assert.assertTrue(
            cartPage.isCartPageDisplayed(),
            "Cart page is not displayed"
    );
}

}