package com.varalakshmy.tests;

import com.varalakshmy.base.BaseTest;
import com.varalakshmy.factory.DriverFactory;
import com.varalakshmy.pages.HomePage;
import com.varalakshmy.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.Test;
import com.varalakshmy.data.TestData;

public class RegistrationTest extends BaseTest {

    @Test
    public void verifyNewUserRegistration() {

        // Open Automation Exercise home page
        DriverFactory.getDriver().get("https://automationexercise.com/");

        // Verify page title
        String actualTitle = DriverFactory.getDriver().getTitle();
        Assert.assertEquals(actualTitle, "Automation Exercise");

        // Click Signup / Login
        HomePage homePage = new HomePage();
        homePage.clickSignupLogin();

        // Verify New User Signup section
        LoginPage loginPage = new LoginPage();

        Assert.assertTrue(
                loginPage.isNewUserSignupDisplayed(),
                "New User Signup text is not displayed"
        );

        // Enter registration details
        loginPage.enterName(TestData.REGISTRATION_NAME);
        loginPage.enterEmail(TestData.REGISTRATION_EMAIL);

        // Click Signup
        loginPage.clickSignup();
    }
}
