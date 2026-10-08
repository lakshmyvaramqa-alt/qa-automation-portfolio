package com.varalakshmy.tests;

import com.varalakshmy.base.BaseTest;
import com.varalakshmy.pages.ContactUsPage;
import com.varalakshmy.pages.HomePage;
import com.varalakshmy.pages.TestCasesPage;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;

@Epic("Customer Support & Static Pages")
@Feature("Contact Us and Test Cases Verification")
public class ContactUsAndStaticTests extends BaseTest {

    @Test(groups = {"smoke", "regression"}, priority = 1)
    @Story("Test Case 6: Contact Us Form")
    @Description("Verify that user can submit the Contact Us form with file upload and JS alert confirmation")
    public void testCase6_contactUsForm() {
        HomePage homePage = new HomePage();
        Assert.assertTrue(homePage.isHomePageDisplayed(), "Home page should be visible");

        ContactUsPage contactUsPage = homePage.clickContactUs();
        Assert.assertTrue(contactUsPage.isGetInTouchDisplayed(), "'GET IN TOUCH' should be visible");

        String filePath = new File("src/test/resources/testfile.txt").getAbsolutePath();
        contactUsPage.fillContactForm(
                "Varalakshmy QA",
                "test@example.com",
                "Portfolio Test Query",
                "This is an automated test message from QA automation portfolio.",
                filePath
        );

        contactUsPage.clickSubmit();
        contactUsPage.acceptAlert();

        Assert.assertTrue(contactUsPage.isSuccessMessageDisplayed(), "Success message should be displayed");
        Assert.assertTrue(contactUsPage.getSuccessMessageText().contains("Success! Your details have been submitted successfully."));

        homePage = contactUsPage.clickHomeButton();
        Assert.assertTrue(homePage.isHomePageDisplayed(), "User should be navigated back to home page");
    }

    @Test(groups = {"smoke", "regression"}, priority = 2)
    @Story("Test Case 7: Verify Test Cases Page")
    @Description("Verify navigation to Test Cases page and visibility of test cases header")
    public void testCase7_verifyTestCasesPage() {
        HomePage homePage = new HomePage();
        TestCasesPage testCasesPage = homePage.clickTestCases();

        Assert.assertTrue(testCasesPage.isTestCasesTitleDisplayed(), "'TEST CASES' title should be visible");
    }
}
