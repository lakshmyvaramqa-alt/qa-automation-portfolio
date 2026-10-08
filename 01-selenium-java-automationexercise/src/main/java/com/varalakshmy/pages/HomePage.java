package com.varalakshmy.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class HomePage extends BasePage {

    private final By homeSlider = By.id("slider-carousel");
    private final By recommendedItemsHeader = By.xpath("//div[@class='recommended_items']//h2[contains(normalize-space(),'recommended items')]");
    private final By recommendedFirstAddToCart = By.xpath("(//div[@id='recommended-item-carousel']//a[contains(@class,'add-to-cart')])[1]");
    private final By viewCartInModal = By.xpath("//div[@id='cartModal']//a[contains(@href,'/view_cart')]");
    private final By scrollUpArrow = By.id("scrollUp");
    private final By topCarouselHeading = By.xpath("//div[@class='item active']//h2[contains(.,'Full-Fledged practice website')] | //div[@class='carousel-inner']//h2[contains(.,'Full-Fledged practice website')]");

    // First product card on home page
    private final By firstViewProductBtn = By.xpath("(//a[contains(@href,'/product_details/')])[1]");

    public HomePage() {
        super();
    }

    public HomePage(WebDriver driver) {
        super(driver);
    }

    public boolean isHomePageDisplayed() {
        return isDisplayed(homeSlider);
    }

    public ProductDetailPage clickFirstViewProduct() {
        scrollIntoView(firstViewProductBtn);
        click(firstViewProductBtn);
        return new ProductDetailPage(driver);
    }

    public boolean isRecommendedItemsHeaderDisplayed() {
        scrollIntoView(recommendedItemsHeader);
        return isDisplayed(recommendedItemsHeader);
    }

    public void addRecommendedItemToCart() {
        scrollIntoView(recommendedFirstAddToCart);
        try {
            click(recommendedFirstAddToCart);
        } catch (Exception e) {
            jsClick(recommendedFirstAddToCart);
        }
    }

    public CartPage clickViewCartInModal() {
        click(viewCartInModal);
        return new CartPage(driver);
    }

    public void clickScrollUpArrow() {
        click(scrollUpArrow);
    }

    public boolean isTopCarouselHeadingDisplayed() {
        return isDisplayed(topCarouselHeading);
    }
}