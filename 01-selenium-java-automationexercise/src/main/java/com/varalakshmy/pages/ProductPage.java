package com.varalakshmy.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.List;

public class ProductPage extends BasePage {

    private final By allProductsTitle = By.xpath("//h2[contains(.,'All Products')]");
    private final By searchInput = By.id("search_product");
    private final By searchButton = By.id("submit_search");
    private final By searchedProductsTitle = By.xpath("//h2[contains(.,'Searched Products')]");
    private final By productCards = By.xpath("//div[@class='features_items']//div[contains(@class,'col-sm-4')]");
    private final By firstViewProductButton = By.xpath("(//a[contains(@href,'/product_details/')])[1]");

    // Add to cart elements
    private final By continueShoppingButton = By.xpath("//button[contains(@class,'close-modal') or contains(text(),'Continue Shopping')]");
    private final By viewCartInModal = By.xpath("//div[@id='cartModal']//a[contains(@href,'/view_cart')]");

    // Category elements
    private final By categoryTitle = By.xpath("//h2[contains(@class,'title')]");
    private final By womenCategory = By.xpath("//a[contains(@href,'#Women')]");
    private final By womenDressSubCategory = By.xpath("//div[@id='Women']//a[contains(normalize-space(),'Dress')]");
    private final By menCategory = By.xpath("//a[contains(@href,'#Men')]");
    private final By menTshirtsSubCategory = By.xpath("//div[@id='Men']//a[contains(normalize-space(),'Tshirts')]");

    // Brands elements
    private final By brandsSidebar = By.xpath("//div[@class='brands_products']");
    private final By brandPolo = By.xpath("//a[contains(@href,'/brand_products/Polo')]");
    private final By brandMadame = By.xpath("//a[contains(@href,'/brand_products/Madame')]");

    public ProductPage() {
        super();
    }

    public ProductPage(WebDriver driver) {
        super(driver);
    }

    public boolean isAllProductsDisplayed() {
        return isDisplayed(allProductsTitle);
    }

    public void searchProduct(String productName) {
        sendKeys(searchInput, productName);
        try {
            click(searchButton);
        } catch (Exception e) {
            jsClick(searchButton);
        }
    }

    public boolean isSearchedProductsDisplayed() {
        return isDisplayed(searchedProductsTitle);
    }

    public List<WebElement> getProductList() {
        return driver.findElements(productCards);
    }

    public ProductDetailPage clickFirstViewProduct() {
        WebElement btn = driver.findElement(firstViewProductButton);
        String targetUrl = btn.getAttribute("href");
        scrollIntoView(firstViewProductButton);
        try {
            click(firstViewProductButton);
        } catch (Exception e) {
            jsClick(firstViewProductButton);
        }
        dismissAdsIfPresent();
        if (!driver.getCurrentUrl().contains("/product_details/") && targetUrl != null) {
            driver.get(targetUrl);
        }
        return new ProductDetailPage(driver);
    }

    public ProductDetailPage clickViewProduct(int index) {
        By viewProductBtn = By.xpath("(//a[contains(@href,'/product_details/')])[" + index + "]");
        WebElement btn = driver.findElement(viewProductBtn);
        String targetUrl = btn.getAttribute("href");
        scrollIntoView(viewProductBtn);
        try {
            click(viewProductBtn);
        } catch (Exception e) {
            jsClick(viewProductBtn);
        }
        dismissAdsIfPresent();
        if (!driver.getCurrentUrl().contains("/product_details/") && targetUrl != null) {
            driver.get(targetUrl);
        }
        return new ProductDetailPage(driver);
    }

    public void addProductToCartByIndex(int index) {
        By addToCartBtn = By.xpath("(//a[@data-product-id='" + index + "'])[1]");
        if (driver.findElements(addToCartBtn).isEmpty()) {
            addToCartBtn = By.xpath("(//div[@class='features_items']//a[contains(@class,'add-to-cart')])[" + index + "]");
        }
        scrollIntoView(addToCartBtn);
        try {
            click(addToCartBtn);
        } catch (Exception e) {
            jsClick(addToCartBtn);
        }
    }

    public void clickContinueShopping() {
        try {
            click(continueShoppingButton);
        } catch (Exception e) {
            jsClick(continueShoppingButton);
        }
        try {
            wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id("cartModal")));
        } catch (Exception ignored) {
        }
    }

    public CartPage clickViewCartInModal() {
        try {
            click(viewCartInModal);
        } catch (Exception e) {
            jsClick(viewCartInModal);
        }
        return new CartPage(driver);
    }

    // Category Navigation
    public void clickWomenCategory() {
        scrollIntoView(womenCategory);
        click(womenCategory);
    }

    public void clickWomenDressCategory() {
        click(womenDressSubCategory);
    }

    public void clickMenCategory() {
        scrollIntoView(menCategory);
        click(menCategory);
    }

    public void clickMenTshirtsCategory() {
        click(menTshirtsSubCategory);
    }

    public String getCategoryTitleText() {
        return getText(categoryTitle);
    }

    // Brand Navigation
    public boolean isBrandsSidebarDisplayed() {
        scrollIntoView(brandsSidebar);
        return isDisplayed(brandsSidebar);
    }

    public void clickBrandPolo() {
        scrollIntoView(brandPolo);
        click(brandPolo);
    }

    public void clickBrandMadame() {
        scrollIntoView(brandMadame);
        click(brandMadame);
    }

    public String getBrandPageTitleText() {
        return getText(categoryTitle);
    }
}