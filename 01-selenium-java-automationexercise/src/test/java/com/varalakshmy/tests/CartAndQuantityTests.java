package com.varalakshmy.tests;

import com.varalakshmy.base.BaseTest;
import com.varalakshmy.data.TestData;
import com.varalakshmy.pages.*;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.Test;

@Epic("Cart Management")
@Feature("Cart Operations, Quantities, and Recommended Items")
public class CartAndQuantityTests extends BaseTest {

    @Test(groups = {"smoke", "regression"}, priority = 1)
    @Story("Test Case 12: Add Products in Cart")
    @Description("Verify adding multiple products to cart and verifying their presence in cart")
    public void testCase12_addProductsInCart() {
        HomePage homePage = new HomePage();
        ProductPage productPage = homePage.clickProducts();

        productPage.addProductToCartByIndex(1);
        productPage.clickContinueShopping();

        productPage.addProductToCartByIndex(2);
        CartPage cartPage = productPage.clickViewCartInModal();

        Assert.assertTrue(cartPage.isCartPageDisplayed(), "Cart page should be displayed");
        Assert.assertTrue(cartPage.getCartItemCount() >= 2, "Cart should contain at least 2 items");
    }

    @Test(groups = {"regression"}, priority = 2)
    @Story("Test Case 13: Verify Product quantity in Cart")
    @Description("Verify product quantity matches in cart after increasing quantity on product details page")
    public void testCase13_verifyProductQuantityInCart() {
        HomePage homePage = new HomePage();
        ProductDetailPage detailPage = homePage.clickFirstViewProduct();

        int targetQuantity = 4;
        detailPage.setQuantity(targetQuantity);
        detailPage.clickAddToCart();

        CartPage cartPage = detailPage.clickViewCartInModal();
        Assert.assertTrue(cartPage.isCartPageDisplayed(), "Cart page should be displayed");

        String actualQuantity = cartPage.getProductQuantity(1);
        Assert.assertEquals(actualQuantity, String.valueOf(targetQuantity), "Quantity in cart should match selected quantity");
    }

    @Test(groups = {"regression"}, priority = 3)
    @Story("Test Case 17: Remove Products From Cart")
    @Description("Verify that user can remove a product from the cart")
    public void testCase17_removeProductsFromCart() {
        HomePage homePage = new HomePage();
        ProductPage productPage = homePage.clickProducts();

        productPage.addProductToCartByIndex(1);
        CartPage cartPage = productPage.clickViewCartInModal();

        Assert.assertTrue(cartPage.isProductDisplayedInCart(), "Product should be present in cart");
        cartPage.deleteProductFromCart();

        Assert.assertTrue(cartPage.isCartEmpty(), "Cart should be empty after product deletion");
    }

    @Test(groups = {"regression"}, priority = 4)
    @Story("Test Case 20: Search Products and Verify Cart After Login")
    @Description("Verify searched products added to cart persist after logging in")
    public void testCase20_searchProductsAndVerifyCartAfterLogin() {
        HomePage homePage = new HomePage();
        ProductPage productPage = homePage.clickProducts();

        productPage.searchProduct("Jeans");
        Assert.assertTrue(productPage.isSearchedProductsDisplayed(), "Searched products should be displayed");

        productPage.addProductToCartByIndex(1);
        CartPage cartPage = productPage.clickViewCartInModal();
        Assert.assertTrue(cartPage.isProductDisplayedInCart(), "Product should be in cart before login");

        LoginPage loginPage = cartPage.clickSignupLogin();
        String name = TestData.getRandomName();
        String email = TestData.getRandomEmail();

        AccountInformationPage infoPage = loginPage.signup(name, email);
        infoPage.enterPassword(TestData.DEFAULT_PASSWORD);
        infoPage.selectDateOfBirth("1", "1", "1990");
        infoPage.fillAddressDetails(
                TestData.FIRST_NAME, TestData.LAST_NAME, TestData.COMPANY,
                TestData.ADDRESS_1, TestData.ADDRESS_2, TestData.COUNTRY,
                TestData.STATE, TestData.CITY, TestData.ZIPCODE, TestData.MOBILE
        );
        AccountCreatedPage createdPage = infoPage.clickCreateAccount();
        homePage = createdPage.clickContinue();

        cartPage = homePage.clickCart();
        Assert.assertTrue(cartPage.isProductDisplayedInCart(), "Product should still be visible in cart after login");

        AccountDeletedPage deletedPage = homePage.clickDeleteAccount();
        deletedPage.clickContinue();
    }

    @Test(groups = {"regression"}, priority = 5)
    @Story("Test Case 22: Add to cart from Recommended items")
    @Description("Verify adding a product to cart from recommended items section on home page")
    public void testCase22_addToCartFromRecommendedItems() {
        HomePage homePage = new HomePage();
        Assert.assertTrue(homePage.isRecommendedItemsHeaderDisplayed(), "'RECOMMENDED ITEMS' section should be visible");

        homePage.addRecommendedItemToCart();
        CartPage cartPage = homePage.clickViewCartInModal();

        Assert.assertTrue(cartPage.isCartPageDisplayed(), "Cart page should be displayed");
        Assert.assertTrue(cartPage.isProductDisplayedInCart(), "Recommended product should be displayed in cart");
    }
}
