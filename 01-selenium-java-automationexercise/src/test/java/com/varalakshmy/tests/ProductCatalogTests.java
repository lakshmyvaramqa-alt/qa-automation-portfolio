package com.varalakshmy.tests;

import com.varalakshmy.base.BaseTest;
import com.varalakshmy.pages.HomePage;
import com.varalakshmy.pages.ProductDetailPage;
import com.varalakshmy.pages.ProductPage;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.Test;

@Epic("Product Catalog")
@Feature("Products, Search, Categories, Brands and Reviews")
public class ProductCatalogTests extends BaseTest {

    @Test(groups = {"smoke", "regression"}, priority = 1)
    @Story("Test Case 8: Verify All Products and product detail page")
    @Description("Verify that user can navigate to all products page, view product list, and see product details")
    public void testCase8_verifyAllProductsAndProductDetailPage() {
        HomePage homePage = new HomePage();
        ProductPage productPage = homePage.clickProducts();

        Assert.assertTrue(productPage.isAllProductsDisplayed(), "All Products page should be visible");
        Assert.assertFalse(productPage.getProductList().isEmpty(), "Product list should not be empty");

        ProductDetailPage detailPage = productPage.clickFirstViewProduct();
        Assert.assertTrue(detailPage.isProductNameDisplayed(), "Product Name should be visible");
        Assert.assertTrue(detailPage.isProductCategoryDisplayed(), "Product Category should be visible");
        Assert.assertTrue(detailPage.isProductPriceDisplayed(), "Product Price should be visible");
        Assert.assertTrue(detailPage.isProductAvailabilityDisplayed(), "Product Availability should be visible");
        Assert.assertTrue(detailPage.isProductConditionDisplayed(), "Product Condition should be visible");
        Assert.assertTrue(detailPage.isProductBrandDisplayed(), "Product Brand should be visible");
    }

    @Test(groups = {"smoke", "regression"}, priority = 2)
    @Story("Test Case 9: Search Product")
    @Description("Verify that user can search for a product and view search results")
    public void testCase9_searchProduct() {
        HomePage homePage = new HomePage();
        ProductPage productPage = homePage.clickProducts();

        Assert.assertTrue(productPage.isAllProductsDisplayed(), "All Products page should be visible");

        productPage.searchProduct("Blue Top");
        Assert.assertTrue(productPage.isSearchedProductsDisplayed(), "'SEARCHED PRODUCTS' section should be visible");
        Assert.assertFalse(productPage.getProductList().isEmpty(), "Searched products list should not be empty");
    }

    @Test(groups = {"regression"}, priority = 3)
    @Story("Test Case 18: View Category Products")
    @Description("Verify category and subcategory navigation for Women and Men")
    public void testCase18_viewCategoryProducts() {
        HomePage homePage = new HomePage();
        ProductPage productPage = homePage.clickProducts();

        productPage.clickWomenCategory();
        productPage.clickWomenDressCategory();
        Assert.assertTrue(productPage.getCategoryTitleText().toUpperCase().contains("WOMEN - DRESS PRODUCTS"),
                "Category title should confirm Women Dress products");

        productPage.clickMenCategory();
        productPage.clickMenTshirtsCategory();
        Assert.assertTrue(productPage.getCategoryTitleText().toUpperCase().contains("MEN - TSHIRTS PRODUCTS"),
                "Category title should confirm Men Tshirts products");
    }

    @Test(groups = {"regression"}, priority = 4)
    @Story("Test Case 19: View & Cart Brand Products")
    @Description("Verify brand navigation on left sidebar and brand product listing")
    public void testCase19_viewAndCartBrandProducts() {
        HomePage homePage = new HomePage();
        ProductPage productPage = homePage.clickProducts();

        Assert.assertTrue(productPage.isBrandsSidebarDisplayed(), "Brands sidebar should be displayed");

        productPage.clickBrandPolo();
        Assert.assertTrue(productPage.getBrandPageTitleText().toUpperCase().contains("POLO"),
                "Brand page title should confirm Polo products");

        productPage.clickBrandMadame();
        Assert.assertTrue(productPage.getBrandPageTitleText().toUpperCase().contains("MADAME"),
                "Brand page title should confirm Madame products");
    }

    @Test(groups = {"regression"}, priority = 5)
    @Story("Test Case 21: Add review on product")
    @Description("Verify adding a review on a product detail page")
    public void testCase21_addReviewOnProduct() {
        HomePage homePage = new HomePage();
        ProductPage productPage = homePage.clickProducts();

        ProductDetailPage detailPage = productPage.clickFirstViewProduct();
        Assert.assertTrue(detailPage.isWriteYourReviewDisplayed(), "'Write Your Review' header should be visible");

        detailPage.submitReview("Varalakshmy QA", "reviewer@test.com", "Excellent quality product, tested through automated framework.");
        Assert.assertTrue(detailPage.isReviewSuccessAlertDisplayed(), "Success message for review should be displayed");
    }
}
