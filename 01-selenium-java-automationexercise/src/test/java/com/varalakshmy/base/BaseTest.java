package com.varalakshmy.base;

import com.varalakshmy.config.ConfigReader;
import com.varalakshmy.factory.DriverFactory;
import org.openqa.selenium.WebDriver;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Optional;
import org.testng.annotations.Parameters;

import java.lang.reflect.Method;

public class BaseTest {

    private long testStartTime;

    @BeforeMethod(alwaysRun = true)
    @Parameters({"browser"})
    public void setUp(@Optional("") String browser, Method method) {
        testStartTime = System.currentTimeMillis();
        System.out.println(">>> Starting Test: " + method.getName() + " | Thread ID: " + Thread.currentThread().getId());

        DriverFactory.initDriver(browser);
        DriverFactory.getDriver().get(ConfigReader.getBaseUrl());
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown(ITestResult result, Method method) {
        long duration = System.currentTimeMillis() - testStartTime;
        System.out.println(">>> Finished Test: " + method.getName() + " | Status: " + getResultStatus(result.getStatus()) + " | Duration: " + duration + " ms");
        DriverFactory.quitDriver();
    }

    public WebDriver getDriver() {
        return DriverFactory.getDriver();
    }

    private String getResultStatus(int status) {
        return switch (status) {
            case ITestResult.SUCCESS -> "PASSED";
            case ITestResult.FAILURE -> "FAILED";
            case ITestResult.SKIP -> "SKIPPED";
            default -> "UNKNOWN";
        };
    }
}