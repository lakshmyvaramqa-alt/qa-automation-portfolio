package com.varalakshmy.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class CheckoutPage extends BasePage {

    private final By deliveryAddressBlock = By.id("address_delivery");
    private final By billingAddressBlock = By.id("address_invoice");
    private final By commentTextarea = By.name("message");
    private final By placeOrderButton = By.xpath("//a[contains(@href,'/payment') and contains(normalize-space(),'Place Order')]");

    public CheckoutPage() {
        super();
    }

    public CheckoutPage(WebDriver driver) {
        super(driver);
    }

    public boolean isAddressDetailsDisplayed() {
        return isDisplayed(deliveryAddressBlock) && isDisplayed(billingAddressBlock);
    }

    public String getDeliveryAddressText() {
        return getText(deliveryAddressBlock);
    }

    public String getBillingAddressText() {
        return getText(billingAddressBlock);
    }

    public void enterComment(String comment) {
        scrollIntoView(commentTextarea);
        sendKeys(commentTextarea, comment);
    }

    public PaymentPage clickPlaceOrder() {
        scrollIntoView(placeOrderButton);
        click(placeOrderButton);
        return new PaymentPage(driver);
    }
}
