package com.varalakshmy.tests;

import com.varalakshmy.base.BaseTest;
import com.varalakshmy.pages.HomePage;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.Test;

@Epic("UI Navigation")
@Feature("Scroll Up and Down Functionality")
public class ScrollTests extends BaseTest {

    @Test(groups = {"regression"}, priority = 1)
    @Story("Test Case 25: Verify Scroll Up using 'Arrow' button and Scroll Down functionality")
    @Description("Verify page scrolls to bottom for subscription and scrolls up using bottom-right arrow button")
    public void testCase25_scrollUpUsingArrowButton() {
        HomePage homePage = new HomePage();
        Assert.assertTrue(homePage.isHomePageDisplayed(), "Home page should be visible");

        homePage.scrollToBottom();
        Assert.assertTrue(homePage.isSubscriptionHeaderDisplayed(), "'SUBSCRIPTION' text should be visible after scroll down");

        homePage.clickScrollUpArrow();
        Assert.assertTrue(homePage.isTopCarouselHeadingDisplayed(),
                "'Full-Fledged practice website for Automation Engineers' text should be visible after scroll up");
    }

    @Test(groups = {"regression"}, priority = 2)
    @Story("Test Case 26: Verify Scroll Up without 'Arrow' button and Scroll Down functionality")
    @Description("Verify page scrolls to bottom for subscription and scrolls up smoothly without arrow button")
    public void testCase26_scrollUpWithoutArrowButton() {
        HomePage homePage = new HomePage();
        Assert.assertTrue(homePage.isHomePageDisplayed(), "Home page should be visible");

        homePage.scrollToBottom();
        Assert.assertTrue(homePage.isSubscriptionHeaderDisplayed(), "'SUBSCRIPTION' text should be visible after scroll down");

        homePage.scrollToTop();
        Assert.assertTrue(homePage.isTopCarouselHeadingDisplayed(),
                "'Full-Fledged practice website for Automation Engineers' text should be visible after scroll up");
    }
}
