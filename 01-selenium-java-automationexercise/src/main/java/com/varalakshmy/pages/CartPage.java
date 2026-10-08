package com.varalakshmy.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class CartPage extends BasePage {

    private final By cartProductRows = By.xpath("//tr[contains(@id,'product-')]");
    private final By firstProductAddToCartBtn = By.xpath("(//a[contains(@class,'add-to-cart')])[1]");
    private final By firstProductCard = By.xpath("(//div[contains(@class,'product-image-wrapper')])[1]");
    private final By viewCartInModal = By.xpath("//div[@id='cartModal']//a[contains(@href,'/view_cart')]");
    private final By deleteProductButtons = By.cssSelector("a.cart_quantity_delete");
    private final By cartEmptyMessage = By.xpath("//b[contains(text(),'Cart is empty!')]");
    private final By proceedToCheckoutButton = By.xpath("//a[contains(@class,'check_out') and contains(normalize-space(),'Proceed To Checkout')]");
    private final By registerLoginModalLink = By.xpath("//div[@id='checkoutModal']//a[contains(@href,'/login')]");

    public CartPage() {
        super();
    }

    public CartPage(WebDriver driver) {
        super(driver);
    }

    public boolean isCartPageDisplayed() {
        return waitForUrlContains("/view_cart");
    }

    public void addFirstProductToCart() {
        scrollIntoView(firstProductCard);
        try {
            click(firstProductAddToCartBtn);
        } catch (Exception e) {
            jsClick(firstProductAddToCartBtn);
        }
    }

    @Override
    public CartPage clickCart() {
        try {
            click(viewCartInModal);
        } catch (Exception e) {
            jsClick(viewCartInModal);
        }
        waitForUrlContains("/view_cart");
        return this;
    }

    public CartPage clickViewCartInModal() {
        return clickCart();
    }

    public boolean isProductDisplayedInCart() {
        return isDisplayed(cartProductRows);
    }

    public int getCartItemCount() {
        List<WebElement> items = driver.findElements(cartProductRows);
        return items.size();
    }

    public String getProductQuantity(int index) {
        By qtyLocator = By.xpath("(//tr[contains(@id,'product-')]//button[@class='disabled'])[" + index + "]");
        return getText(qtyLocator);
    }

    public void deleteProductFromCart() {
        if (isDisplayed(deleteProductButtons)) {
            click(deleteProductButtons);
        }
    }

    public boolean isCartEmpty() {
        return isDisplayed(cartEmptyMessage);
    }

    public CheckoutPage clickProceedToCheckout() {
        click(proceedToCheckoutButton);
        return new CheckoutPage(driver);
    }

    public LoginPage clickRegisterLoginInModal() {
        click(registerLoginModalLink);
        return new LoginPage(driver);
    }
}