package com.varalakshmy.tests;

import com.varalakshmy.base.BaseTest;
import com.varalakshmy.data.TestData;
import com.varalakshmy.pages.*;
import com.varalakshmy.utils.JsonUtils;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.Map;

@Epic("Authentication")
@Feature("User Registration and Login")
public class AuthTests extends BaseTest {

    @DataProvider(name = "loginUsersJson")
    public Object[][] getLoginUsers() {
        return JsonUtils.getJsonDataAsObjectArray("testdata/users.json");
    }

    @Test(groups = {"smoke", "regression"}, priority = 1)
    @Story("Test Case 1: Register User")
    @Description("Verify that a new user can register, fill account details, verify creation, and delete the account")
    public void testCase1_registerUser() {
        HomePage homePage = new HomePage();
        Assert.assertTrue(homePage.isHomePageDisplayed(), "Home page should be visible");

        LoginPage loginPage = homePage.clickSignupLogin();
        Assert.assertTrue(loginPage.isNewUserSignupDisplayed(), "New User Signup should be visible");

        String name = TestData.getRandomName();
        String email = TestData.getRandomEmail();

        AccountInformationPage accountInfoPage = loginPage.signup(name, email);
        Assert.assertTrue(accountInfoPage.isEnterAccountInformationDisplayed(), "Enter Account Info header should be visible");

        accountInfoPage.selectTitle("Mr");
        accountInfoPage.enterPassword(TestData.DEFAULT_PASSWORD);
        accountInfoPage.selectDateOfBirth("15", "5", "1995");
        accountInfoPage.selectNewsletter();
        accountInfoPage.selectSpecialOffers();

        accountInfoPage.fillAddressDetails(
                TestData.FIRST_NAME, TestData.LAST_NAME, TestData.COMPANY,
                TestData.ADDRESS_1, TestData.ADDRESS_2, TestData.COUNTRY,
                TestData.STATE, TestData.CITY, TestData.ZIPCODE, TestData.MOBILE
        );

        AccountCreatedPage accountCreatedPage = accountInfoPage.clickCreateAccount();
        Assert.assertTrue(accountCreatedPage.isAccountCreatedDisplayed(), "'ACCOUNT CREATED!' should be visible");

        homePage = accountCreatedPage.clickContinue();
        Assert.assertTrue(homePage.isLoggedInAsUser(name), "Logged in as username should be visible");

        AccountDeletedPage accountDeletedPage = homePage.clickDeleteAccount();
        Assert.assertTrue(accountDeletedPage.isAccountDeletedDisplayed(), "'ACCOUNT DELETED!' should be visible");
        accountDeletedPage.clickContinue();
    }

    @Test(groups = {"smoke", "regression"}, priority = 2)
    @Story("Test Case 2: Login User with correct email and password")
    @Description("Verify that user can log in with valid credentials and delete the account")
    public void testCase2_loginUserWithCorrectCredentials() {
        HomePage homePage = new HomePage();
        Assert.assertTrue(homePage.isHomePageDisplayed(), "Home page should be visible");

        LoginPage loginPage = homePage.clickSignupLogin();
        String name = TestData.getRandomName();
        String email = TestData.getRandomEmail();

        // Register first so valid credentials exist
        AccountInformationPage accountInfoPage = loginPage.signup(name, email);
        accountInfoPage.enterPassword(TestData.DEFAULT_PASSWORD);
        accountInfoPage.selectDateOfBirth("1", "1", "1990");
        accountInfoPage.fillAddressDetails(
                TestData.FIRST_NAME, TestData.LAST_NAME, TestData.COMPANY,
                TestData.ADDRESS_1, TestData.ADDRESS_2, TestData.COUNTRY,
                TestData.STATE, TestData.CITY, TestData.ZIPCODE, TestData.MOBILE
        );
        AccountCreatedPage createdPage = accountInfoPage.clickCreateAccount();
        homePage = createdPage.clickContinue();
        loginPage = homePage.clickLogout();

        // Test login
        Assert.assertTrue(loginPage.isLoginToAccountDisplayed(), "Login to your account should be visible");
        homePage = loginPage.login(email, TestData.DEFAULT_PASSWORD);
        Assert.assertTrue(homePage.isLoggedInAsUser(name), "User should be logged in");

        AccountDeletedPage deletedPage = homePage.clickDeleteAccount();
        Assert.assertTrue(deletedPage.isAccountDeletedDisplayed(), "Account should be deleted");
        deletedPage.clickContinue();
    }

    @Test(groups = {"regression"}, priority = 3)
    @Story("Test Case 3: Login User with incorrect email and password")
    @Description("Verify error message when logging in with invalid email and password")
    public void testCase3_loginUserWithIncorrectCredentials() {
        HomePage homePage = new HomePage();
        LoginPage loginPage = homePage.clickSignupLogin();

        Assert.assertTrue(loginPage.isLoginToAccountDisplayed(), "Login to your account should be visible");
        loginPage.login("nonexistent_user_999@invalid.com", "WrongPassword123!");

        Assert.assertTrue(loginPage.isLoginErrorDisplayed(), "Error 'Your email or password is incorrect!' should be displayed");
    }

    @Test(groups = {"regression"}, priority = 4)
    @Story("Test Case 4: Logout User")
    @Description("Verify that user can log out and is redirected to login page")
    public void testCase4_logoutUser() {
        HomePage homePage = new HomePage();
        LoginPage loginPage = homePage.clickSignupLogin();

        String name = TestData.getRandomName();
        String email = TestData.getRandomEmail();

        AccountInformationPage accountInfoPage = loginPage.signup(name, email);
        accountInfoPage.enterPassword(TestData.DEFAULT_PASSWORD);
        accountInfoPage.selectDateOfBirth("1", "1", "1990");
        accountInfoPage.fillAddressDetails(
                TestData.FIRST_NAME, TestData.LAST_NAME, TestData.COMPANY,
                TestData.ADDRESS_1, TestData.ADDRESS_2, TestData.COUNTRY,
                TestData.STATE, TestData.CITY, TestData.ZIPCODE, TestData.MOBILE
        );
        AccountCreatedPage createdPage = accountInfoPage.clickCreateAccount();
        homePage = createdPage.clickContinue();

        Assert.assertTrue(homePage.isLoggedInAsUser(name), "User should be logged in");
        loginPage = homePage.clickLogout();
        Assert.assertTrue(loginPage.isLoginToAccountDisplayed(), "User should be redirected to login page");
    }

    @Test(groups = {"regression"}, priority = 5)
    @Story("Test Case 5: Register User with existing email")
    @Description("Verify error message when trying to register with an already existing email")
    public void testCase5_registerUserWithExistingEmail() {
        HomePage homePage = new HomePage();
        LoginPage loginPage = homePage.clickSignupLogin();

        String name = TestData.getRandomName();
        String email = TestData.getRandomEmail();

        // Register first
        AccountInformationPage accountInfoPage = loginPage.signup(name, email);
        accountInfoPage.enterPassword(TestData.DEFAULT_PASSWORD);
        accountInfoPage.selectDateOfBirth("1", "1", "1990");
        accountInfoPage.fillAddressDetails(
                TestData.FIRST_NAME, TestData.LAST_NAME, TestData.COMPANY,
                TestData.ADDRESS_1, TestData.ADDRESS_2, TestData.COUNTRY,
                TestData.STATE, TestData.CITY, TestData.ZIPCODE, TestData.MOBILE
        );
        AccountCreatedPage createdPage = accountInfoPage.clickCreateAccount();
        homePage = createdPage.clickContinue();
        loginPage = homePage.clickLogout();

        // Try registering with same email
        loginPage.enterName(name);
        loginPage.enterEmail(email);
        loginPage.click(org.openqa.selenium.By.xpath("//button[@data-qa='signup-button']"));

        Assert.assertTrue(loginPage.isExistingEmailErrorDisplayed(), "Error 'Email Address already exist!' should be displayed");
    }

    @Test(dataProvider = "loginUsersJson", groups = {"data-driven", "regression"}, priority = 6)
    @Story("Data-Driven: Login tests fed by users.json")
    @Description("Data-driven test verifying login behavior for multiple accounts defined in users.json")
    public void testDataDrivenLogin(Map<String, String> user) {
        HomePage homePage = new HomePage();
        LoginPage loginPage = homePage.clickSignupLogin();

        loginPage.enterLoginEmail(user.get("email"));
        loginPage.enterLoginPassword(user.get("password"));
        loginPage.clickLogin();

        if ("failure".equalsIgnoreCase(user.get("expectedResult"))) {
            Assert.assertTrue(loginPage.isLoginErrorDisplayed(), "Login error message expected for: " + user.get("description"));
        }
    }
}
