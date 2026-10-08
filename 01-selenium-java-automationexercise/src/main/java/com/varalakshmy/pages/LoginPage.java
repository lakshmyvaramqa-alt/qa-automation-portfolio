package com.varalakshmy.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {

    // Locators
    private final By newUserSignupText = By.xpath("//h2[contains(text(),'New User Signup!')]");
    private final By loginToAccountText = By.xpath("//h2[contains(text(),'Login to your account')]");

    // Signup Locators
    private final By nameField = By.xpath("//input[@data-qa='signup-name']");
    private final By emailField = By.xpath("//input[@data-qa='signup-email']");
    private final By signupButton = By.xpath("//button[@data-qa='signup-button']");
    private final By existingEmailErrorMessage = By.xpath("//p[contains(text(),'Email Address already exist!')]");

    // Login Locators
    private final By loginEmailField = By.xpath("//input[@data-qa='login-email']");
    private final By loginPasswordField = By.xpath("//input[@data-qa='login-password']");
    private final By loginButton = By.xpath("//button[@data-qa='login-button']");
    private final By loginErrorMessage = By.xpath("//p[contains(text(),'Your email or password is incorrect!')]");

    public LoginPage() {
        super();
    }

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    // Verify sections
    public boolean isNewUserSignupDisplayed() {
        return isDisplayed(newUserSignupText);
    }

    public boolean isLoginToAccountDisplayed() {
        return isDisplayed(loginToAccountText);
    }

    // Signup Methods
    public void enterName(String name) {
        sendKeys(nameField, name);
    }

    public void enterEmail(String email) {
        sendKeys(emailField, email);
    }

    public AccountInformationPage clickSignup() {
        click(signupButton);
        return new AccountInformationPage(driver);
    }

    public AccountInformationPage signup(String name, String email) {
        enterName(name);
        enterEmail(email);
        return clickSignup();
    }

    public boolean isExistingEmailErrorDisplayed() {
        return isDisplayed(existingEmailErrorMessage);
    }

    // Login Methods
    public void enterLoginEmail(String email) {
        sendKeys(loginEmailField, email);
    }

    public void enterLoginPassword(String password) {
        sendKeys(loginPasswordField, password);
    }

    public HomePage clickLogin() {
        click(loginButton);
        return new HomePage(driver);
    }

    public HomePage login(String email, String password) {
        enterLoginEmail(email);
        enterLoginPassword(password);
        return clickLogin();
    }

    public boolean isLoginErrorDisplayed() {
        return isDisplayed(loginErrorMessage);
    }
}