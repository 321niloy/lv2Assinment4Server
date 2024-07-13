declare module 'sslcommerz-lts' {
  export default class SSLCommerzPayment {
    constructor(store_id: string, store_password: string, is_live: boolean);

    init(data: any): Promise<any>;
    // Add other methods and types as needed
  }
}
