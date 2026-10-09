export interface CustomerUser {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export type PaymentMethod =
  | 'bank-transfer'
  | 'cash-on-delivery'
  | 'credit-card'
  | 'buy-now-pay-later'
  | 'gift-card';

export interface PaymentDetails {
  method: PaymentMethod;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  creditCardNumber?: string;
  expirationDate?: string;
  cvv?: string;
  cardHolderName?: string;
  monthlyInstallments?: string;
  giftCardNumber?: string;
  validationCode?: string;
}
