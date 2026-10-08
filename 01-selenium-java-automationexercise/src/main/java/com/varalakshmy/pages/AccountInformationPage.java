package com.varalakshmy.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.Select;

public class AccountInformationPage extends BasePage {

    private final By enterAccountInfoHeader = By.xpath("//b[contains(normalize-space(),'Enter Account Information')]");
    private final By titleMrRadio = By.id("id_gender1");
    private final By titleMrsRadio = By.id("id_gender2");
    private final By passwordInput = By.id("password");
    private final By daysSelect = By.id("days");
    private final By monthsSelect = By.id("months");
    private final By yearsSelect = By.id("years");
    private final By newsletterCheckbox = By.id("newsletter");
    private final By specialOffersCheckbox = By.id("optin");

    // Address info
    private final By firstNameInput = By.id("first_name");
    private final By lastNameInput = By.id("last_name");
    private final By companyInput = By.id("company");
    private final By address1Input = By.id("address1");
    private final By address2Input = By.id("address2");
    private final By countrySelect = By.id("country");
    private final By stateInput = By.id("state");
    private final By cityInput = By.id("city");
    private final By zipcodeInput = By.id("zipcode");
    private final By mobileNumberInput = By.id("mobile_number");
    private final By createAccountButton = By.xpath("//button[@data-qa='create-account']");

    public AccountInformationPage() {
        super();
    }

    public AccountInformationPage(WebDriver driver) {
        super(driver);
    }

    public boolean isEnterAccountInformationDisplayed() {
        return isDisplayed(enterAccountInfoHeader);
    }

    public void selectTitle(String title) {
        if ("Mrs".equalsIgnoreCase(title)) {
            click(titleMrsRadio);
        } else {
            click(titleMrRadio);
        }
    }

    public void enterPassword(String password) {
        sendKeys(passwordInput, password);
    }

    public void selectDateOfBirth(String day, String month, String year) {
        new Select(driver.findElement(daysSelect)).selectByValue(day);
        new Select(driver.findElement(monthsSelect)).selectByValue(month);
        new Select(driver.findElement(yearsSelect)).selectByValue(year);
    }

    public void selectNewsletter() {
        if (!driver.findElement(newsletterCheckbox).isSelected()) {
            click(newsletterCheckbox);
        }
    }

    public void selectSpecialOffers() {
        if (!driver.findElement(specialOffersCheckbox).isSelected()) {
            click(specialOffersCheckbox);
        }
    }

    public void fillAddressDetails(String firstName, String lastName, String company, String address1,
                                   String address2, String country, String state, String city,
                                   String zipcode, String mobileNumber) {
        sendKeys(firstNameInput, firstName);
        sendKeys(lastNameInput, lastName);
        if (company != null) sendKeys(companyInput, company);
        sendKeys(address1Input, address1);
        if (address2 != null) sendKeys(address2Input, address2);
        new Select(driver.findElement(countrySelect)).selectByVisibleText(country);
        sendKeys(stateInput, state);
        sendKeys(cityInput, city);
        sendKeys(zipcodeInput, zipcode);
        sendKeys(mobileNumberInput, mobileNumber);
    }

    public AccountCreatedPage clickCreateAccount() {
        scrollIntoView(createAccountButton);
        click(createAccountButton);
        return new AccountCreatedPage(driver);
    }
}
