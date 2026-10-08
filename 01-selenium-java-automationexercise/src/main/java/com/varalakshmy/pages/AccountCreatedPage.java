package com.varalakshmy.pages;

import com.varalakshmy.config.ConfigReader;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class AccountCreatedPage extends BasePage {

    private final By accountCreatedHeader = By.xpath("//*[@data-qa='account-created'] | //b[contains(text(),'Account Created!')] | //h2[contains(.,'Account Created!')]");
    private final By continueButton = By.xpath("//*[@data-qa='continue-button'] | //a[contains(text(),'Continue')]");

    public AccountCreatedPage() {
        super();
    }

    public AccountCreatedPage(WebDriver driver) {
        super(driver);
    }

    public boolean isAccountCreatedDisplayed() {
        dismissAdsIfPresent();
        if (driver.getCurrentUrl().contains("#google_vignette")) {
            driver.get(driver.getCurrentUrl().replace("#google_vignette", ""));
        }
        return isDisplayed(accountCreatedHeader);
    }

    public HomePage clickContinue() {
        try {
            click(continueButton);
        } catch (Exception e) {
            jsClick(continueButton);
        }
        dismissAdsIfPresent();
        if (driver.getCurrentUrl().contains("#google_vignette") || driver.getCurrentUrl().contains("/account_created")) {
            driver.get(ConfigReader.getBaseUrl());
        }
        return new HomePage(driver);
    }
}
