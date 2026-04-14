import{test as setup,expect} from "../fixture/testfixture"

setup("Authentication User", async({loginPage,page,logindata}) => {
    
    await loginPage.navigateUrl()
    console.log(page.url())
    await expect(loginPage.email).toBeVisible()
    await loginPage.loginUser(logindata.email, logindata.password,logindata.otp)
       
    await page.waitForURL(/executive-summary/)

    await page.context().storageState({path: 'storage/auth.json'})

})