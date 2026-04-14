import {test as Base, expect} from "@playwright/test"
import { LoginPage } from "../pages/LoginPage"
import logindata from "../testdata/logindata.json"
import { Dashboard } from "../pages/DashboardPage"
import { ProductPage } from "../pages/ProductsPage"
import { generateProduct } from "../util/datautils"

type MyFixture={
    loginPage:LoginPage
    logindata: typeof logindata
    dashboardPage : Dashboard
    productPage : ProductPage
    product: {
    productname: string
    }
}

export const test = Base.extend<MyFixture>({
    loginPage: async ({page},use) =>{
       const loginPage = new LoginPage(page)
       await use(loginPage)
    },

    logindata :async ({}, use) => {
       await use(logindata)
    },

    dashboardPage: async ({page,logindata},use) =>{
        const dashboardPage = new Dashboard(page)
        await page.goto('/executive-summary')
        await dashboardPage.selectMerchantFromDashboard(logindata.merchantid)
        expect(dashboardPage.selectmerchant).toBeVisible
        await use(dashboardPage)
    },

    productPage: async ({page}, use) =>{
        const productPage = new ProductPage(page)
        await use(productPage)
    },

    product :async ({},use) =>{
        const productname = generateProduct();
        await use({productname})
    },
})

export {expect} from "@playwright/test"