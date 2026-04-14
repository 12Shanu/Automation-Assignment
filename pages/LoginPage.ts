import { Page,expect } from "playwright/test"

export class LoginPage{

    readonly email
    readonly page
    readonly next_btn
    readonly pass
    readonly otp
    readonly verifyotp

    constructor(page:Page){
        this.page=page
        this.email = page.getByPlaceholder('example@email.com')
        this.next_btn = page.getByRole('button', { name: 'Next' })
        this.pass = page.locator('input[type="password"]')
        this.otp = page.getByPlaceholder('******')
        this.verifyotp = page.getByText('Verify OTP')
    }

    async navigateUrl(){
       await this.page.goto(
        'https://qa-mdashboard.dev.gokwik.in/login',
     {
        timeout: 60000,
        waitUntil: 'load', 
    }
    )}

    async loginUser(email:string,password:string,otp:string){
        await this.email.fill(email)
        await this.next_btn.click()
        await this.pass.fill(password)
        await this.next_btn.click()
        await this.verifyotp.isVisible()
        await this.otp.fill(otp)
        await this.next_btn.click()
    }
}