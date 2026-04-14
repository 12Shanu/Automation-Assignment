import { Locator, Page, expect } from "playwright/test"

export class ProductPage{

    readonly page
    readonly add_btn
    readonly title
    readonly variant_btn
    readonly variant_menu
    readonly sel_var
    readonly sku
    readonly createproduct_btn
    readonly search_txt
    readonly threelinemenu
    readonly delete_btn
    readonly delete_alert
    readonly ok_btn
    readonly delete_msg
    readonly totalcount
    readonly savechanges_btn

    constructor(page:Page){
        this.page = page
        this.add_btn = page.getByRole('button', { name: 'Add product' })
        this.title = page.getByRole('textbox', { name: 'Short sleeve t-shirt' })
        this.variant_btn = page.getByText('Add Variants')
        this.variant_menu = page.getByRole('menu')
        this.sel_var = page.getByText('1 variant', { exact: true })
        this.sku = page.getByRole('textbox', { name: 'Enter SKU' }).first()
        this.createproduct_btn = page.getByRole('button', { name: 'Create Product' })
        this.search_txt = page.getByRole('textbox', { name: 'Search' })
        this.threelinemenu = page.getByRole('img', { name: 'Share' })
        this.delete_btn = page.getByText('Delete products')
        this.delete_alert = page.getByText('Are you sure you want to delete 1 product?')
        this.ok_btn = page.getByText('OK', { exact: true })
        this.delete_msg = page.getByText('Products deleted successfully')
        this.totalcount = page.getByText('Total 0 Items', { exact: true })
        this.savechanges_btn = page.getByRole('button', { name: 'Save Changes' })
    }

    async createProduct(product:string,page:Page){
        await this.add_btn.click()
        await page.locator('.ant-spin').waitFor({ state: 'hidden' })
        await this.title.fill(product)
        
        await page.locator("[data-test-id='description_card_category_label']")
        .locator('..').locator('.ant-select-selector').click()
        const catdropdown = page.locator('.ant-select-dropdown')
        await catdropdown.waitFor({ state: 'visible' });
        const catoptions = catdropdown.locator("[role='treeitem']").filter({
        has: page.locator('span')
        })
        await this.handleSelectOptions(catoptions,page)
        await catdropdown.waitFor({ state: 'hidden' })

        await this.variant_btn.click()
        const vardropdown = page.locator('.ant-dropdown:visible')
        await vardropdown.waitFor()
        const varoptions = vardropdown.locator('[role="menuitem"]:not(.ant-dropdown-menu-item-disabled)')
        await varoptions.first().waitFor()
        const optionText=await this.handleSelectOptions(varoptions,page)
        await vardropdown.waitFor({ state: 'hidden' })
        
        await page.locator('.ant-select', { hasText: `Select ${optionText} values` }).click()
        const dropdown = page.locator('.ant-select-dropdown:visible')
        await dropdown.waitFor()
        const options = dropdown.locator('.ant-select-item-option:not(.ant-select-item-option-disabled)')
        await this.handleSelectOptions(options,page)
        await dropdown.waitFor({ state: 'hidden' })
        
        await this.sel_var.click()
        await this.sku.fill("122")
        await this.createproduct_btn.scrollIntoViewIfNeeded()
        await this.createproduct_btn.click()
        await page.locator('.ant-spin').waitFor({ state: 'hidden' })
        await page.getByText('Product created successfully').isVisible()
        await page.locator('.ant-breadcrumb-separator').locator('..').locator(':text("PRODUCTS")').click()
        return product
    }

    async validateProductInList(page:Page,product:string){
        await expect(page.getByRole('link', { name: `${product}` })).toBeVisible()    //Validate Product
        await expect(page.locator('span').filter({ hasText: 'Active' }).first()).toBeVisible()   //Validate Status
        await expect(page.locator('span').filter({ hasText: '1 variants' }).first()).toBeVisible()      //Validate Variant Count
    }

    async searchProductByName(product:string){
        await this.search_txt.fill(product)
    }

    async deleteProduct(page:Page){
        await page.waitForSelector('tbody.ant-table-tbody tr')
        const rows = page.locator('tbody.ant-table-tbody tr')
        const count = await rows.count()
        if (count === 0) throw new Error("No Rows found")
        let randomIndex = Math.floor(Math.random() * count)
        if(randomIndex===0){
            randomIndex=1
        }
        const productvalue = await page.locator(`//tbody/tr[${randomIndex}]/td[2]//a`).innerText()
        await page.getByRole('checkbox').nth(randomIndex).click()
        await this.threelinemenu.click()
        await this.delete_btn.click()
        await expect(this.delete_alert).toBeVisible()
        await this.ok_btn.click()
        await expect(this.delete_msg).toBeVisible()
        await this.searchProductByName(productvalue)
        await expect(this.totalcount).toBeVisible()
    }

    async updateExistingProduct(page:Page, newproductname:string){
        await page.waitForSelector('tbody.ant-table-tbody tr')
        const rows = page.locator('tbody.ant-table-tbody tr')
        const count = await rows.count()
        if (count === 0) throw new Error("No Rows found")
        let randomIndex = Math.floor(Math.random() * count)
        if(randomIndex===0){
            randomIndex=1
        }
        const productname = await page.locator(`//tbody/tr[${randomIndex}]/td[2]//a`).innerText()
        //console.log("Before Modify Name:",productname)
        rows.nth(randomIndex).click();
        await this.title.fill(newproductname)
        await this.savechanges_btn.scrollIntoViewIfNeeded()
        await this.savechanges_btn.click()
        await page.locator('.ant-spin').waitFor({ state: 'hidden' })
        await page.getByText('Product updated successfully').isVisible()
        await page.locator("//div[@class='cursor-pointer']").click()
        //console.log("After Modify Name:",newproductname)
        return newproductname
    }

    async verifyMandatoryValidation(page:Page, productname:string){
        await this.add_btn.click()
        await expect(page.getByText('Title is required')).toBeVisible()
        await this.title.fill(productname)
        await this.createproduct_btn.scrollIntoViewIfNeeded()
        await this.createproduct_btn.click()
        await expect(page.getByText('SKU is required')).toBeVisible()
    }

    async handleSelectOptions(options:Locator,page:Page){
        const count = await options.count()
        if (count === 0) throw new Error("No options found")
        const randomIndex = Math.floor(Math.random() * (count - 1))
        const selectedOption = options.nth(randomIndex)
        await selectedOption.waitFor({ state: 'visible' })
        const optionText = await selectedOption.innerText()
        await selectedOption.click()
        await page.keyboard.press('Escape')
        return optionText
    }
}