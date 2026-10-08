package com.varalakshmy.pages;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.io.File;

public class ContactUsPage extends BasePage {

    private final By getInTouchTitle = By.xpath("//h2[contains(normalize-space(),'Get In Touch')]");
    private final By nameInput = By.xpath("//input[@data-qa='name']");
    private final By emailInput = By.xpath("//input[@data-qa='email']");
    private final By subjectInput = By.xpath("//input[@data-qa='subject']");
    private final By messageTextarea = By.xpath("//textarea[@data-qa='message']");
    private final By uploadFileInput = By.name("upload_file");
    private final By submitButton = By.xpath("//input[@data-qa='submit-button']");
    private final By successMessage = By.xpath("//div[contains(@class,'status') and contains(@class,'alert-success')]");
    private final By homeButton = By.xpath("//a[contains(@class,'btn-success') and contains(normalize-space(),'Home')]");

    public ContactUsPage() {
        super();
    }

    public ContactUsPage(WebDriver driver) {
        super(driver);
    }

    public boolean isGetInTouchDisplayed() {
        return isDisplayed(getInTouchTitle);
    }

    public void fillContactForm(String name, String email, String subject, String message, String filePath) {
        sendKeys(nameInput, name);
        sendKeys(emailInput, email);
        sendKeys(subjectInput, subject);
        sendKeys(messageTextarea, message);

        if (filePath != null && !filePath.isEmpty()) {
            WebElement fileUpload = driver.findElement(uploadFileInput);
            File file = new File(filePath);
            fileUpload.sendKeys(file.getAbsolutePath());
        }
    }

    public void clickSubmit() {
        scrollIntoView(submitButton);
        click(submitButton);
    }

    public void acceptAlert() {
        wait.until(d -> {
            try {
                Alert alert = d.switchTo().alert();
                alert.accept();
                return true;
            } catch (Exception e) {
                return false;
            }
        });
    }

    public boolean isSuccessMessageDisplayed() {
        return isDisplayed(successMessage);
    }

    public String getSuccessMessageText() {
        return getText(successMessage);
    }

    public HomePage clickHomeButton() {
        click(homeButton);
        return new HomePage(driver);
    }
}
