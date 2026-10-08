package com.varalakshmy.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class PaymentPage extends BasePage {

    private final By nameOnCardInput = By.xpath("//input[@data-qa='name-on-card']");
    private final By cardNumberInput = By.xpath("//input[@data-qa='card-number']");
    private final By cvcInput = By.xpath("//input[@data-qa='cvc']");
    private final By expiryMonthInput = By.xpath("//input[@data-qa='expiry-month']");
    private final By expiryYearInput = By.xpath("//input[@data-qa='expiry-year']");
    private final By payAndConfirmOrderButton = By.xpath("//button[@data-qa='pay-button']");

    // Success Screen
    private final By orderSuccessMessage = By.xpath("//p[contains(normalize-space(),'Congratulations! Your order has been confirmed!')] | //*[contains(normalize-space(),'Order Placed!')]");
    private final By downloadInvoiceButton = By.xpath("//a[contains(@href,'download_invoice')]");
    private final By continueButton = By.xpath("//a[@data-qa='continue-button']");

    public PaymentPage() {
        super();
    }

    public PaymentPage(WebDriver driver) {
        super(driver);
    }

    public void enterPaymentDetails(String cardName, String cardNumber, String cvc, String expiryMonth, String expiryYear) {
        sendKeys(nameOnCardInput, cardName);
        sendKeys(cardNumberInput, cardNumber);
        sendKeys(cvcInput, cvc);
        sendKeys(expiryMonthInput, expiryMonth);
        sendKeys(expiryYearInput, expiryYear);
    }

    public void clickPayAndConfirmOrder() {
        scrollIntoView(payAndConfirmOrderButton);
        click(payAndConfirmOrderButton);
    }

    public boolean isOrderSuccessMessageDisplayed() {
        return isDisplayed(orderSuccessMessage);
    }

    public boolean isDownloadInvoiceButtonDisplayed() {
        return isDisplayed(downloadInvoiceButton);
    }

    public void clickDownloadInvoice() {
        click(downloadInvoiceButton);
    }

    public HomePage clickContinue() {
        click(continueButton);
        return new HomePage(driver);
    }
}
