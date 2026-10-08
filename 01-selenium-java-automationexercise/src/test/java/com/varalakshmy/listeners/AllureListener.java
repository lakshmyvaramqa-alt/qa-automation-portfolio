package com.varalakshmy.listeners;

import com.varalakshmy.factory.DriverFactory;
import io.qameta.allure.Attachment;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

public class AllureListener implements ITestListener {

    @Attachment(value = "Failure Screenshot - {0}", type = "image/png")
    public byte[] saveScreenshotOnFailure(String testName) {
        WebDriver driver = DriverFactory.getDriver();
        if (driver != null) {
            try {
                return ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
            } catch (Exception e) {
                System.err.println("Could not capture screenshot: " + e.getMessage());
            }
        }
        return new byte[0];
    }

    @Attachment(value = "Failure Details", type = "text/plain")
    public String saveTextLog(String message) {
        return message;
    }

    @Override
    public void onTestFailure(ITestResult result) {
        System.out.println(">>> Test FAILED: " + result.getName() + " - Capturing failure screenshot for Allure...");
        saveScreenshotOnFailure(result.getName());
        if (result.getThrowable() != null) {
            saveTextLog("Failure reason: " + result.getThrowable().getMessage());
        }
    }

    @Override
    public void onTestStart(ITestResult result) {}

    @Override
    public void onTestSuccess(ITestResult result) {}

    @Override
    public void onTestSkipped(ITestResult result) {}

    @Override
    public void onTestFailedButWithinSuccessPercentage(ITestResult result) {}

    @Override
    public void onStart(ITestContext context) {}

    @Override
    public void onFinish(ITestContext context) {}
}
