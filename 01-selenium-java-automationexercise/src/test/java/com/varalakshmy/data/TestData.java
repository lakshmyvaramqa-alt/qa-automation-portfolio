package com.varalakshmy.data;

import java.util.UUID;

public class TestData {

    // Legacy fields for backward compatibility
    public static final String REGISTRATION_NAME = "Varalakshmy";
    public static final String REGISTRATION_EMAIL = "varalakshmy12345@gmail.com";

    // Standard test attributes
    public static final String DEFAULT_PASSWORD = "Password123!";
    public static final String FIRST_NAME = "Varalakshmy";
    public static final String LAST_NAME = "QA";
    public static final String COMPANY = "PortfolioQA";
    public static final String ADDRESS_1 = "123 Automation Blvd";
    public static final String ADDRESS_2 = "Suite 100";
    public static final String COUNTRY = "United States";
    public static final String STATE = "California";
    public static final String CITY = "Los Angeles";
    public static final String ZIPCODE = "90001";
    public static final String MOBILE = "1234567890";

    // Payment Info
    public static final String CARD_NAME = "Varalakshmy QA";
    public static final String CARD_NUMBER = "4111111111111111";
    public static final String CARD_CVC = "311";
    public static final String CARD_EXPIRY_MONTH = "12";
    public static final String CARD_EXPIRY_YEAR = "2028";

    public static String getRandomEmail() {
        return "user_" + UUID.randomUUID().toString().substring(0, 8) + "@testmail.com";
    }

    public static String getRandomName() {
        return "User_" + UUID.randomUUID().toString().substring(0, 6);
    }
}