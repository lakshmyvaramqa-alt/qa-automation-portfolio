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

@Epic("Order Placement & Checkout")
@Feature("Checkout, Address Verification, Payment, and Invoice")
public class OrderAndCheckoutTests extends BaseTest {

    @Test(groups = {"smoke", "regression"}, priority = 1)
    @Story("Test Case 14: Place Order: Register while Checkout")
    @Description("Verify placing an order with account registration during checkout flow")
    public void testCase14_placeOrderRegisterWhileCheckout() {
        HomePage homePage = new HomePage();
        ProductPage productPage = homePage.clickProducts();

        productPage.addProductToCartByIndex(1);
        CartPage cartPage = productPage.clickViewCartInModal();
        Assert.assertTrue(cartPage.isCartPageDisplayed(), "Cart page should be displayed");

        cartPage.clickProceedToCheckout();
        LoginPage loginPage = cartPage.clickRegisterLoginInModal();

        String name = TestData.getRandomName();
        String email = TestData.getRandomEmail();

        AccountInformationPage infoPage = loginPage.signup(name, email);
        infoPage.enterPassword(TestData.DEFAULT_PASSWORD);
        infoPage.selectDateOfBirth("10", "10", "1992");
        infoPage.fillAddressDetails(
                TestData.FIRST_NAME, TestData.LAST_NAME, TestData.COMPANY,
                TestData.ADDRESS_1, TestData.ADDRESS_2, TestData.COUNTRY,
                TestData.STATE, TestData.CITY, TestData.ZIPCODE, TestData.MOBILE
        );
        AccountCreatedPage createdPage = infoPage.clickCreateAccount();
        homePage = createdPage.clickContinue();
        Assert.assertTrue(homePage.isLoggedInAsUser(name), "User should be logged in");

        cartPage = homePage.clickCart();
        CheckoutPage checkoutPage = cartPage.clickProceedToCheckout();

        Assert.assertTrue(checkoutPage.isAddressDetailsDisplayed(), "Address details should be displayed");
        checkoutPage.enterComment("Order test - Register while checkout");

        PaymentPage paymentPage = checkoutPage.clickPlaceOrder();
        paymentPage.enterPaymentDetails(
                TestData.CARD_NAME, TestData.CARD_NUMBER, TestData.CARD_CVC,
                TestData.CARD_EXPIRY_MONTH, TestData.CARD_EXPIRY_YEAR
        );
        paymentPage.clickPayAndConfirmOrder();

        Assert.assertTrue(paymentPage.isOrderSuccessMessageDisplayed(), "Order success message should be displayed");

        AccountDeletedPage deletedPage = paymentPage.clickDeleteAccount();
        deletedPage.clickContinue();
    }

    @Test(groups = {"regression"}, priority = 2)
    @Story("Test Case 15: Place Order: Register before Checkout")
    @Description("Verify placing an order when registering an account before adding items to cart")
    public void testCase15_placeOrderRegisterBeforeCheckout() {
        HomePage homePage = new HomePage();
        LoginPage loginPage = homePage.clickSignupLogin();

        String name = TestData.getRandomName();
        String email = TestData.getRandomEmail();

        AccountInformationPage infoPage = loginPage.signup(name, email);
        infoPage.enterPassword(TestData.DEFAULT_PASSWORD);
        infoPage.selectDateOfBirth("12", "12", "1991");
        infoPage.fillAddressDetails(
                TestData.FIRST_NAME, TestData.LAST_NAME, TestData.COMPANY,
                TestData.ADDRESS_1, TestData.ADDRESS_2, TestData.COUNTRY,
                TestData.STATE, TestData.CITY, TestData.ZIPCODE, TestData.MOBILE
        );
        AccountCreatedPage createdPage = infoPage.clickCreateAccount();
        homePage = createdPage.clickContinue();
        Assert.assertTrue(homePage.isLoggedInAsUser(name), "User should be logged in");

        ProductPage productPage = homePage.clickProducts();
        productPage.addProductToCartByIndex(1);
        CartPage cartPage = productPage.clickViewCartInModal();

        CheckoutPage checkoutPage = cartPage.clickProceedToCheckout();
        Assert.assertTrue(checkoutPage.isAddressDetailsDisplayed(), "Address details should be displayed");
        checkoutPage.enterComment("Order test - Register before checkout");

        PaymentPage paymentPage = checkoutPage.clickPlaceOrder();
        paymentPage.enterPaymentDetails(
                TestData.CARD_NAME, TestData.CARD_NUMBER, TestData.CARD_CVC,
                TestData.CARD_EXPIRY_MONTH, TestData.CARD_EXPIRY_YEAR
        );
        paymentPage.clickPayAndConfirmOrder();

        Assert.assertTrue(paymentPage.isOrderSuccessMessageDisplayed(), "Order success message should be displayed");

        AccountDeletedPage deletedPage = paymentPage.clickDeleteAccount();
        deletedPage.clickContinue();
    }

    @Test(groups = {"regression"}, priority = 3)
    @Story("Test Case 16: Place Order: Login before Checkout")
    @Description("Verify placing an order after logging into an existing account")
    public void testCase16_placeOrderLoginBeforeCheckout() {
        HomePage homePage = new HomePage();
        LoginPage loginPage = homePage.clickSignupLogin();

        String name = TestData.getRandomName();
        String email = TestData.getRandomEmail();

        AccountInformationPage infoPage = loginPage.signup(name, email);
        infoPage.enterPassword(TestData.DEFAULT_PASSWORD);
        infoPage.selectDateOfBirth("5", "5", "1994");
        infoPage.fillAddressDetails(
                TestData.FIRST_NAME, TestData.LAST_NAME, TestData.COMPANY,
                TestData.ADDRESS_1, TestData.ADDRESS_2, TestData.COUNTRY,
                TestData.STATE, TestData.CITY, TestData.ZIPCODE, TestData.MOBILE
        );
        AccountCreatedPage createdPage = infoPage.clickCreateAccount();
        homePage = createdPage.clickContinue();
        loginPage = homePage.clickLogout();

        // Login before checkout
        homePage = loginPage.login(email, TestData.DEFAULT_PASSWORD);
        Assert.assertTrue(homePage.isLoggedInAsUser(name), "User should be logged in");

        ProductPage productPage = homePage.clickProducts();
        productPage.addProductToCartByIndex(1);
        CartPage cartPage = productPage.clickViewCartInModal();

        CheckoutPage checkoutPage = cartPage.clickProceedToCheckout();
        Assert.assertTrue(checkoutPage.isAddressDetailsDisplayed(), "Address details should be displayed");
        checkoutPage.enterComment("Order test - Login before checkout");

        PaymentPage paymentPage = checkoutPage.clickPlaceOrder();
        paymentPage.enterPaymentDetails(
                TestData.CARD_NAME, TestData.CARD_NUMBER, TestData.CARD_CVC,
                TestData.CARD_EXPIRY_MONTH, TestData.CARD_EXPIRY_YEAR
        );
        paymentPage.clickPayAndConfirmOrder();

        Assert.assertTrue(paymentPage.isOrderSuccessMessageDisplayed(), "Order success message should be displayed");

        AccountDeletedPage deletedPage = paymentPage.clickDeleteAccount();
        deletedPage.clickContinue();
    }

    @Test(groups = {"regression"}, priority = 4)
    @Story("Test Case 23: Verify address details in checkout page")
    @Description("Verify that delivery and billing address match registration details during checkout")
    public void testCase23_verifyAddressDetailsInCheckoutPage() {
        HomePage homePage = new HomePage();
        LoginPage loginPage = homePage.clickSignupLogin();

        String name = TestData.getRandomName();
        String email = TestData.getRandomEmail();

        AccountInformationPage infoPage = loginPage.signup(name, email);
        infoPage.enterPassword(TestData.DEFAULT_PASSWORD);
        infoPage.selectDateOfBirth("8", "8", "1993");
        infoPage.fillAddressDetails(
                TestData.FIRST_NAME, TestData.LAST_NAME, TestData.COMPANY,
                TestData.ADDRESS_1, TestData.ADDRESS_2, TestData.COUNTRY,
                TestData.STATE, TestData.CITY, TestData.ZIPCODE, TestData.MOBILE
        );
        AccountCreatedPage createdPage = infoPage.clickCreateAccount();
        homePage = createdPage.clickContinue();

        ProductPage productPage = homePage.clickProducts();
        productPage.addProductToCartByIndex(1);
        CartPage cartPage = productPage.clickViewCartInModal();

        CheckoutPage checkoutPage = cartPage.clickProceedToCheckout();
        Assert.assertTrue(checkoutPage.isAddressDetailsDisplayed(), "Address details should be displayed");

        String deliveryText = checkoutPage.getDeliveryAddressText();
        String billingText = checkoutPage.getBillingAddressText();

        Assert.assertTrue(deliveryText.contains(TestData.ADDRESS_1), "Delivery address must contain address 1");
        Assert.assertTrue(deliveryText.contains(TestData.CITY), "Delivery address must contain city");
        Assert.assertTrue(billingText.contains(TestData.ADDRESS_1), "Billing address must contain address 1");
        Assert.assertTrue(billingText.contains(TestData.CITY), "Billing address must contain city");

        AccountDeletedPage deletedPage = checkoutPage.clickDeleteAccount();
        deletedPage.clickContinue();
    }

    @Test(groups = {"regression"}, priority = 5)
    @Story("Test Case 24: Download Invoice after purchase order")
    @Description("Verify invoice download option after completing purchase order")
    public void testCase24_downloadInvoiceAfterPurchaseOrder() {
        HomePage homePage = new HomePage();
        ProductPage productPage = homePage.clickProducts();

        productPage.addProductToCartByIndex(1);
        CartPage cartPage = productPage.clickViewCartInModal();

        cartPage.clickProceedToCheckout();
        LoginPage loginPage = cartPage.clickRegisterLoginInModal();

        String name = TestData.getRandomName();
        String email = TestData.getRandomEmail();

        AccountInformationPage infoPage = loginPage.signup(name, email);
        infoPage.enterPassword(TestData.DEFAULT_PASSWORD);
        infoPage.selectDateOfBirth("4", "4", "1994");
        infoPage.fillAddressDetails(
                TestData.FIRST_NAME, TestData.LAST_NAME, TestData.COMPANY,
                TestData.ADDRESS_1, TestData.ADDRESS_2, TestData.COUNTRY,
                TestData.STATE, TestData.CITY, TestData.ZIPCODE, TestData.MOBILE
        );
        AccountCreatedPage createdPage = infoPage.clickCreateAccount();
        homePage = createdPage.clickContinue();

        cartPage = homePage.clickCart();
        CheckoutPage checkoutPage = cartPage.clickProceedToCheckout();
        checkoutPage.enterComment("Download Invoice Test");

        PaymentPage paymentPage = checkoutPage.clickPlaceOrder();
        paymentPage.enterPaymentDetails(
                TestData.CARD_NAME, TestData.CARD_NUMBER, TestData.CARD_CVC,
                TestData.CARD_EXPIRY_MONTH, TestData.CARD_EXPIRY_YEAR
        );
        paymentPage.clickPayAndConfirmOrder();

        Assert.assertTrue(paymentPage.isOrderSuccessMessageDisplayed(), "Order placed successfully message should be displayed");
        Assert.assertTrue(paymentPage.isDownloadInvoiceButtonDisplayed(), "Download Invoice button should be visible");
        paymentPage.clickDownloadInvoice();

        AccountDeletedPage deletedPage = paymentPage.clickDeleteAccount();
        deletedPage.clickContinue();
    }
}
