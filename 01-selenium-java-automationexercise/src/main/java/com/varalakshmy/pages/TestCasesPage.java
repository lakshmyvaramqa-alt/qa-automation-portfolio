package com.varalakshmy.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class TestCasesPage extends BasePage {

    private final By testCasesTitle = By.xpath("//h2[contains(@class,'title') and contains(normalize-space(),'Test Cases')]");

    public TestCasesPage() {
        super();
    }

    public TestCasesPage(WebDriver driver) {
        super(driver);
    }

    public boolean isTestCasesTitleDisplayed() {
        return isDisplayed(testCasesTitle);
    }
}
