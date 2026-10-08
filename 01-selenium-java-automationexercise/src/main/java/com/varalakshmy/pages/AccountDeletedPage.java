package com.varalakshmy.pages;

import com.varalakshmy.config.ConfigReader;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class AccountDeletedPage extends BasePage {

    private final By accountDeletedHeader = By.xpath("//*[@data-qa='account-deleted'] | //b[contains(text(),'Account Deleted!')] | //h2[contains(.,'Account Deleted!')]");
    private final By continueButton = By.xpath("//*[@data-qa='continue-button'] | //a[contains(text(),'Continue')]");

    public AccountDeletedPage() {
        super();
    }

    public AccountDeletedPage(WebDriver driver) {
        super(driver);
    }

    public boolean isAccountDeletedDisplayed() {
        dismissAdsIfPresent();
        if (driver.getCurrentUrl().contains("#google_vignette")) {
            driver.get(driver.getCurrentUrl().replace("#google_vignette", ""));
        }
        return isDisplayed(accountDeletedHeader);
    }

    public HomePage clickContinue() {
        try {
            click(continueButton);
        } catch (Exception e) {
            jsClick(continueButton);
        }
        dismissAdsIfPresent();
        if (driver.getCurrentUrl().contains("#google_vignette") || driver.getCurrentUrl().contains("/delete_account")) {
            driver.get(ConfigReader.getBaseUrl());
        }
        return new HomePage(driver);
    }
}
