import { Page,expect } from "playwright/test";

export class Dashboard{

    readonly page
    readonly switchmerchant
    readonly merchantid
    readonly selectmerchant
    readonly setmerchant_btn
    readonly moduleName

    constructor (page:Page){
        this.page = page
        this.switchmerchant = page.getByRole('button', { name: 'qa.gokwik' })
        this.merchantid = page.locator("//input[contains(@class,'mt-3 mb-1.5')]")
        this.selectmerchant = page.getByText('Weryzee QA')
        this.setmerchant_btn = page.getByRole('button', { name: 'Set Merchant' })
        this.moduleName = page.getByRole('listitem')
    }

    async selectMerchantFromDashboard(merchantid:string){
        await this.switchmerchant.click()
        await this.merchantid.isVisible()
        await this.merchantid.fill(merchantid)
        await this.selectmerchant.isVisible()
        await this.selectmerchant.click()
        await this.setmerchant_btn.click()
      }
    
    async moduleClick(page:Page,module:string, submodule:string){
        await page.getByRole('menuitem', { name: module }).click()
        await page.getByRole('menuitem', { name: submodule }).click()
    }
}