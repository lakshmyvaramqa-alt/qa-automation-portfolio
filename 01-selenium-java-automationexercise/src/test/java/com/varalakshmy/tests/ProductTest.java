package com.varalakshmy.tests;

import com.varalakshmy.base.BaseTest;
import com.varalakshmy.pages.ProductPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ProductTest extends BaseTest {

    @Test
    public void verifyAllProductsPage() {

        ProductPage productPage = new ProductPage();

        productPage.clickProducts();

        Assert.assertTrue(
                productPage.isAllProductsDisplayed(),
                "All Products page is not displayed"
        );
    }

    @Test
    public void verifyProductSearch() {

        ProductPage productPage = new ProductPage();

        productPage.clickProducts();

        productPage.searchProduct("Blue Top");

        Assert.assertTrue(
                productPage.isSearchedProductsDisplayed(),
                "Searched Products section is not displayed"
        );
    }
}