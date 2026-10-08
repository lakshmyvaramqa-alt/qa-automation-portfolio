package com.varalakshmy.tests;

import com.varalakshmy.base.BaseTest;
import com.varalakshmy.pages.CartPage;
import com.varalakshmy.pages.HomePage;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.Test;

@Epic("Subscription")
@Feature("Newsletter Subscription")
public class SubscriptionTests extends BaseTest {

    @Test(groups = {"smoke", "regression"}, priority = 1)
    @Story("Test Case 10: Verify Subscription in home page")
    @Description("Verify that user can subscribe to newsletter on home page footer")
    public void testCase10_verifySubscriptionInHomePage() {
        HomePage homePage = new HomePage();
        Assert.assertTrue(homePage.isHomePageDisplayed(), "Home page should be visible");

        Assert.assertTrue(homePage.isSubscriptionHeaderDisplayed(), "Subscription header should be visible in footer");

        homePage.subscribeEmail("portfolio_subscribe@test.com");
        Assert.assertTrue(homePage.isSubscribeSuccessMessageDisplayed(), "Subscription success message should be displayed");
    }

    @Test(groups = {"regression"}, priority = 2)
    @Story("Test Case 11: Verify Subscription in Cart page")
    @Description("Verify that user can subscribe to newsletter on cart page footer")
    public void testCase11_verifySubscriptionInCartPage() {
        HomePage homePage = new HomePage();
        CartPage cartPage = homePage.clickCart();

        Assert.assertTrue(cartPage.isCartPageDisplayed(), "Cart page should be visible");
        Assert.assertTrue(cartPage.isSubscriptionHeaderDisplayed(), "Subscription header should be visible in cart footer");

        cartPage.subscribeEmail("portfolio_cart_subscribe@test.com");
        Assert.assertTrue(cartPage.isSubscribeSuccessMessageDisplayed(), "Subscription success message should be displayed");
    }
}
