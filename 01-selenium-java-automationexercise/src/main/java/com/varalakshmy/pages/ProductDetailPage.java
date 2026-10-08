package com.varalakshmy.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ProductDetailPage extends BasePage {

    private final By productName = By.xpath("//div[@class='product-information']/h2");
    private final By productCategory = By.xpath("//div[@class='product-information']/p[contains(text(),'Category')]");
    private final By productPrice = By.xpath("//div[@class='product-information']//span/span");
    private final By productAvailability = By.xpath("//div[@class='product-information']/p[b[contains(text(),'Availability')]]");
    private final By productCondition = By.xpath("//div[@class='product-information']/p[b[contains(text(),'Condition')]]");
    private final By productBrand = By.xpath("//div[@class='product-information']/p[b[contains(text(),'Brand')]]");

    // Quantity & Add to Cart
    private final By quantityInput = By.id("quantity");
    private final By addToCartButton = By.xpath("//button[contains(@class,'cart')]");
    private final By viewCartInModalLink = By.xpath("//div[@id='cartModal']//a[contains(@href,'/view_cart')]");

    // Review Form
    private final By writeReviewHeader = By.xpath("//a[contains(normalize-space(),'Write Your Review')]");
    private final By reviewNameInput = By.id("name");
    private final By reviewEmailInput = By.id("email");
    private final By reviewTextInput = By.id("review");
    private final By reviewSubmitButton = By.id("button-review");
    private final By reviewSuccessAlert = By.xpath("//div[contains(@class,'alert-success')]//span[contains(text(),'Thank you for your review.')] | //div[contains(@class,'alert-success')]");

    public ProductDetailPage() {
        super();
    }

    public ProductDetailPage(WebDriver driver) {
        super(driver);
    }

    public boolean isProductNameDisplayed() {
        return isDisplayed(productName);
    }

    public String getProductName() {
        return getText(productName);
    }

    public boolean isProductCategoryDisplayed() {
        return isDisplayed(productCategory);
    }

    public boolean isProductPriceDisplayed() {
        return isDisplayed(productPrice);
    }

    public boolean isProductAvailabilityDisplayed() {
        return isDisplayed(productAvailability);
    }

    public boolean isProductConditionDisplayed() {
        return isDisplayed(productCondition);
    }

    public boolean isProductBrandDisplayed() {
        return isDisplayed(productBrand);
    }

    public void setQuantity(int quantity) {
        driver.findElement(quantityInput).clear();
        driver.findElement(quantityInput).sendKeys(String.valueOf(quantity));
    }

    public void clickAddToCart() {
        click(addToCartButton);
    }

    public CartPage clickViewCartInModal() {
        click(viewCartInModalLink);
        return new CartPage(driver);
    }

    public boolean isWriteYourReviewDisplayed() {
        scrollIntoView(writeReviewHeader);
        return isDisplayed(writeReviewHeader);
    }

    public void submitReview(String name, String email, String review) {
        scrollIntoView(reviewNameInput);
        sendKeys(reviewNameInput, name);
        sendKeys(reviewEmailInput, email);
        sendKeys(reviewTextInput, review);
        click(reviewSubmitButton);
    }

    public boolean isReviewSuccessAlertDisplayed() {
        return isDisplayed(reviewSuccessAlert);
    }
}
