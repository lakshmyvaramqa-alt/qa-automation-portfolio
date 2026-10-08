package com.varalakshmy.tests;

import com.varalakshmy.base.BaseTest;
import com.varalakshmy.factory.DriverFactory;
import com.varalakshmy.pages.HomePage;
import com.varalakshmy.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LoginTest extends BaseTest {

    @Test
    public void verifyNewUserSignupSection() {

     DriverFactory.getDriver().get("https://automationexercise.com/");

        HomePage homePage = new HomePage();
        homePage.clickSignupLogin();

        LoginPage loginPage = new LoginPage();

        Assert.assertTrue(
                loginPage.isNewUserSignupDisplayed(),
                "New User Signup section is not displayed"
        );
    }


    @Test
    public void verifyLoginWithInvalidCredentials() {

    DriverFactory.getDriver().get("https://automationexercise.com/");

    HomePage homePage = new HomePage();
    homePage.clickSignupLogin();

    LoginPage loginPage = new LoginPage();

    loginPage.enterLoginEmail("invalid@test.com");
    loginPage.enterLoginPassword("Invalid123");
    loginPage.clickLogin();

    Assert.assertTrue(
            loginPage.isLoginErrorDisplayed(),
            "Login error message is not displayed"
    );
}

@Test
public void verifyLoginToYourAccountSection() {

    DriverFactory.getDriver().get("https://automationexercise.com/");

    HomePage homePage = new HomePage();
    homePage.clickSignupLogin();

    LoginPage loginPage = new LoginPage();

    Assert.assertTrue(
            loginPage.isLoginToAccountDisplayed(),
            "Login to your account section is not displayed"
    );
}

}
