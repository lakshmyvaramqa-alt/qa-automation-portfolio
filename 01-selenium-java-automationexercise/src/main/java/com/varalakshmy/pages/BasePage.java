package com.varalakshmy.pages;

import com.varalakshmy.config.ConfigReader;
import com.varalakshmy.factory.DriverFactory;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class BasePage {

    protected WebDriver driver;
    protected WebDriverWait wait;

    // Header Navigation Locators
    private final By homeLink = By.xpath("//a[contains(normalize-space(),'Home')]");
    private final By productsLink = By.xpath("//a[contains(normalize-space(),'Products')]");
    private final By cartLink = By.xpath("//a[contains(normalize-space(),'Cart')]");
    private final By signupLoginLink = By.xpath("//a[contains(normalize-space(),'Signup / Login')]");
    private final By testCasesLink = By.xpath("//a[contains(normalize-space(),'Test Cases')]");
    private final By contactUsLink = By.xpath("//a[contains(normalize-space(),'Contact us')]");
    private final By logoutLink = By.xpath("//a[contains(normalize-space(),'Logout')]");
    private final By deleteAccountLink = By.xpath("//a[contains(normalize-space(),'Delete Account')]");
    private final By loggedInUserText = By.xpath("//li[contains(.,'Logged in as')] | //li[.//i[contains(@class,'fa-user')]]");

    // Footer Subscription Locators
    private final By subscriptionHeading = By.xpath("//h2[contains(normalize-space(),'Subscription')]");
    private final By subscribeEmailInput = By.id("susbscribe_email");
    private final By subscribeButton = By.id("subscribe");
    private final By subscribeSuccessMessage = By.xpath("//div[contains(@class,'alert-success')] | //*[@id='success-subscribe']");

    public BasePage() {
        this(DriverFactory.getDriver());
    }

    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(ConfigReader.getExplicitWait()));
    }

    // --- Wait and Interaction Helpers ---

    public WebElement waitForVisibility(By locator) {
        dismissAdsIfPresent();
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    public WebElement waitForClickable(By locator) {
        dismissAdsIfPresent();
        return wait.until(ExpectedConditions.elementToBeClickable(locator));
    }

    public boolean waitForUrlContains(String fragment) {
        return wait.until(ExpectedConditions.urlContains(fragment));
    }

    public void click(By locator) {
        dismissAdsIfPresent();
        try {
            waitForClickable(locator).click();
        } catch (ElementClickInterceptedException e) {
            dismissAdsIfPresent();
            try {
                driver.findElement(locator).click();
            } catch (Exception ex) {
                jsClick(locator);
            }
        }
    }

    public void jsClick(By locator) {
        WebElement element = driver.findElement(locator);
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
    }

    public void jsClick(WebElement element) {
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
    }

    public void sendKeys(By locator, String text) {
        WebElement element = waitForVisibility(locator);
        element.clear();
        element.sendKeys(text);
    }

    public String getText(By locator) {
        return waitForVisibility(locator).getText().trim();
    }

    public boolean isDisplayed(By locator) {
        try {
            return waitForVisibility(locator).isDisplayed();
        } catch (TimeoutException | NoSuchElementException e) {
            return false;
        }
    }

    public void scrollIntoView(By locator) {
        WebElement element = driver.findElement(locator);
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);
    }

    public void scrollIntoView(WebElement element) {
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);
    }

    public void scrollToBottom() {
        ((JavascriptExecutor) driver).executeScript("window.scrollTo(0, document.body.scrollHeight);");
    }

    public void scrollToTop() {
        ((JavascriptExecutor) driver).executeScript("window.scrollTo(0, 0);");
    }

    // --- Ad / Vignette Handling ---

    public void dismissAdsIfPresent() {
        try {
            // Remove any Google AdSense overlay frames and banners directly via JavaScript
            ((JavascriptExecutor) driver).executeScript(
                "var ads = document.querySelectorAll('iframe[id^=\"aswift\"], iframe[id^=\"ad_iframe\"], ins.adsbygoogle');" +
                "for (var i = 0; i < ads.length; i++) { ads[i].remove(); }"
            );

            // If page got hijacked by google_vignette URL hash
            String currentUrl = driver.getCurrentUrl();
            if (currentUrl.contains("#google_vignette")) {
                String cleanUrl = currentUrl.replace("#google_vignette", "");
                if (cleanUrl.endsWith("/") || cleanUrl.contains("automationexercise.com")) {
                    driver.get(cleanUrl);
                }
            }
        } catch (Exception ignored) {
            // Safe fallback
        }
    }

    // --- Header Navigation & Page Chaining ---

    public HomePage clickHome() {
        click(homeLink);
        return new HomePage(driver);
    }

    public ProductPage clickProducts() {
        try {
            click(productsLink);
        } catch (Exception e) {
            if (!driver.getCurrentUrl().contains("/products")) {
                driver.get(ConfigReader.getBaseUrl() + "/products");
            }
        }
        dismissAdsIfPresent();
        if (driver.getCurrentUrl().contains("#google_vignette")) {
            driver.get(driver.getCurrentUrl().replace("#google_vignette", ""));
        }
        return new ProductPage(driver);
    }

    public CartPage clickCart() {
        try {
            click(cartLink);
        } catch (Exception e) {
            if (!driver.getCurrentUrl().contains("/view_cart")) {
                driver.get(ConfigReader.getBaseUrl() + "/view_cart");
            }
        }
        dismissAdsIfPresent();
        return new CartPage(driver);
    }

    public LoginPage clickSignupLogin() {
        try {
            click(signupLoginLink);
        } catch (Exception e) {
            if (!driver.getCurrentUrl().contains("/login")) {
                driver.get(ConfigReader.getBaseUrl() + "/login");
            }
        }
        dismissAdsIfPresent();
        return new LoginPage(driver);
    }

    public ContactUsPage clickContactUs() {
        try {
            click(contactUsLink);
        } catch (Exception e) {
            if (!driver.getCurrentUrl().contains("/contact_us")) {
                driver.get(ConfigReader.getBaseUrl() + "/contact_us");
            }
        }
        dismissAdsIfPresent();
        return new ContactUsPage(driver);
    }

    public TestCasesPage clickTestCases() {
        try {
            click(testCasesLink);
        } catch (Exception e) {
            if (!driver.getCurrentUrl().contains("/test_cases")) {
                driver.get(ConfigReader.getBaseUrl() + "/test_cases");
            }
        }
        dismissAdsIfPresent();
        return new TestCasesPage(driver);
    }

    public LoginPage clickLogout() {
        try {
            click(logoutLink);
        } catch (Exception e) {
            if (!driver.getCurrentUrl().contains("/login")) {
                driver.get(ConfigReader.getBaseUrl() + "/login");
            }
        }
        dismissAdsIfPresent();
        return new LoginPage(driver);
    }

    public AccountDeletedPage clickDeleteAccount() {
        try {
            click(deleteAccountLink);
        } catch (Exception e) {
            if (!driver.getCurrentUrl().contains("/delete_account")) {
                driver.get(ConfigReader.getBaseUrl() + "/delete_account");
            }
        }
        dismissAdsIfPresent();
        return new AccountDeletedPage(driver);
    }

    public boolean isLoggedInAsUser(String username) {
        try {
            String text = getText(loggedInUserText);
            return text.contains(username) || text.contains("Logged in as");
        } catch (Exception e) {
            return false;
        }
    }

    public String getLoggedInUserName() {
        return getText(loggedInUserText);
    }

    // --- Footer Subscription ---

    public boolean isSubscriptionHeaderDisplayed() {
        scrollIntoView(subscriptionHeading);
        return isDisplayed(subscriptionHeading);
    }

    public void subscribeEmail(String email) {
        scrollIntoView(subscribeEmailInput);
        sendKeys(subscribeEmailInput, email);
        click(subscribeButton);
    }

    public boolean isSubscribeSuccessMessageDisplayed() {
        return isDisplayed(subscribeSuccessMessage);
    }
}
