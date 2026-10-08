package com.varalakshmy.tests;

import com.varalakshmy.base.BaseTest;
import com.varalakshmy.pages.HomePage;
import com.varalakshmy.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class UserRegistrationTest extends BaseTest {

    @Test
    public void verifyNewUserSignup() {

        HomePage homePage = new HomePage();
        homePage.clickSignupLogin();

        LoginPage loginPage = new LoginPage();

        Assert.assertTrue(
                loginPage.isNewUserSignupDisplayed(),
                "New User Signup section is not displayed"
        );

        loginPage.enterName("Varalakshmy");
        loginPage.enterEmail("varalakshmy" + System.currentTimeMillis() + "@test.com");
        loginPage.clickSignup();
    }
}